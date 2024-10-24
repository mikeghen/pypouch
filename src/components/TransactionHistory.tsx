import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { PYUSD_ADDRESS } from "@/config/wagmi";
import { format } from 'date-fns';

const CHUNK_SIZE = 10000n;
const TOTAL_BLOCKS = 100000n;

const TransactionHistory = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['pyusd-transfers', address],
    queryFn: async () => {
      if (!address) return [];

      const latestBlock = await publicClient.getBlockNumber();
      const chunks = [];
      
      // Calculate number of chunks needed
      const numChunks = Number(TOTAL_BLOCKS / CHUNK_SIZE);
      
      // Create array of promises for each chunk
      for (let i = 0; i < numChunks; i++) {
        const fromBlock = latestBlock - TOTAL_BLOCKS + (BigInt(i) * CHUNK_SIZE);
        const toBlock = fromBlock + CHUNK_SIZE - 1n;
        
        chunks.push(
          Promise.all([
            publicClient.getLogs({
              address: PYUSD_ADDRESS,
              event: {
                type: 'event',
                name: 'Transfer',
                inputs: [
                  { type: 'address', name: 'from', indexed: true },
                  { type: 'address', name: 'to', indexed: true },
                  { type: 'uint256', name: 'value' },
                ],
              },
              args: {
                from: address
              },
              fromBlock,
              toBlock
            }),
            publicClient.getLogs({
              address: PYUSD_ADDRESS,
              event: {
                type: 'event',
                name: 'Transfer',
                inputs: [
                  { type: 'address', name: 'from', indexed: true },
                  { type: 'address', name: 'to', indexed: true },
                  { type: 'uint256', name: 'value' },
                ],
              },
              args: {
                to: address
              },
              fromBlock,
              toBlock
            })
          ])
        );
      }

      // Wait for all chunks to complete
      const results = await Promise.all(chunks);
      
      // Flatten and combine all transfers
      const allTransfers = results.flatMap(([from, to]) => [...from, ...to]);
      
      // Get block timestamps for all transfers
      const blocks = await Promise.all(
        allTransfers.map(transfer => 
          publicClient.getBlock({ blockNumber: transfer.blockNumber })
        )
      );

      return allTransfers
        .map((event, index) => {
          const isIncoming = event.args.to?.toLowerCase() === address.toLowerCase();
          const amount = formatUnits(event.args.value || 0n, 6);
          return {
            id: `${event.blockNumber}-${event.logIndex}`,
            date: new Date(Number(blocks[index].timestamp) * 1000),
            type: isIncoming ? 'Receive' : 'Send',
            amount: `${isIncoming ? '+' : '-'}${amount}`,
            from: event.args.from,
            to: event.args.to,
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    enabled: !!address,
  });

  const downloadCSV = () => {
    if (!transactions.length) return;

    const headers = ['Date', 'Type', 'Amount (PYUSD)', 'From', 'To'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(tx => [
        format(tx.date, 'yyyy-MM-dd HH:mm:ss'),
        tx.type,
        tx.amount,
        tx.from,
        tx.to
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pyusd-transfers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your transaction history is being downloaded",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCSV}
          className="flex items-center gap-2"
          disabled={!transactions.length}
        >
          <DownloadIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Download CSV</span>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[80px]">Type</TableHead>
              <TableHead className="w-[120px] text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(tx.date, 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{tx.type}</TableCell>
                  <TableCell className={`text-right whitespace-nowrap ${
                    tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}>
                    {tx.amount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TransactionHistory;
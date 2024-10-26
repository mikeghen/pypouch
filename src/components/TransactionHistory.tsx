import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { format } from 'date-fns';
import { CHUNK_SIZE, TOTAL_BLOCKS } from '@/utils/constants';
import { fetchTransferLogs } from '@/utils/transferLogs';
import { TransactionTable } from './TransactionTable';
import { PYPOUCH_CONTRACT_ADDRESS } from '@/config/contracts';

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
      
      const numChunks = Number(TOTAL_BLOCKS / CHUNK_SIZE);
      
      for (let i = 0; i < numChunks; i++) {
        const fromBlock = latestBlock - TOTAL_BLOCKS + (BigInt(i) * CHUNK_SIZE);
        const toBlock = fromBlock + CHUNK_SIZE - 1n;
        chunks.push(fetchTransferLogs(publicClient, address, fromBlock, toBlock));
      }

      const results = await Promise.all(chunks);
      const allTransfers = results.flatMap(([from, to]) => [...from, ...to]);
      
      const blocks = await Promise.all(
        allTransfers.map(transfer => 
          publicClient.getBlock({ blockNumber: transfer.blockNumber })
        )
      );

      return allTransfers
        .map((event, index) => {
          const isIncoming = event.args.to?.toLowerCase() === address.toLowerCase();
          const amount = Number(formatUnits(event.args.value || 0n, 6)).toFixed(2);
          const isDeposit = event.args.to?.toLowerCase() === PYPOUCH_CONTRACT_ADDRESS.toLowerCase();
          
          let type = isIncoming ? 'Receive' : (isDeposit ? 'Deposit' : 'Send');
          
          return {
            id: `${event.blockNumber}-${event.logIndex}`,
            date: new Date(Number(blocks[index].timestamp) * 1000),
            type,
            amount: `${isIncoming ? '+' : '-'}${amount}`,
            from: event.args.from,
            to: event.args.to,
            hash: event.transactionHash
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
        <TransactionTable transactions={transactions} isLoading={isLoading} />
      </div>
    </Card>
  );
};

export default TransactionHistory;
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

const transactions = [
  {
    id: 1,
    date: "2024-02-20",
    type: "Interest",
    amount: "+0.12",
  },
  {
    id: 2,
    date: "2024-02-20",
    type: "Deposit",
    amount: "+500.00",
  },
  {
    id: 3,
    date: "2024-02-19",
    type: "Interest",
    amount: "+0.11",
  },
  {
    id: 4,
    date: "2024-02-19",
    type: "Send",
    amount: "-200.00",
  },
  {
    id: 5,
    date: "2024-02-18",
    type: "Interest",
    amount: "+0.09",
  },
  {
    id: 6,
    date: "2024-02-18",
    type: "Receive",
    amount: "+300.00",
  },
  {
    id: 7,
    date: "2024-02-17",
    type: "Interest",
    amount: "+0.08",
  },
  {
    id: 8,
    date: "2024-02-17",
    type: "Withdraw",
    amount: "-150.00",
  },
];

const TransactionHistory = () => {
  const { toast } = useToast();

  const calculateRunningBalance = () => {
    let balance = 0;
    return transactions.map(tx => {
      balance += parseFloat(tx.amount);
      return { ...tx, balance: balance.toFixed(2) };
    }).reverse(); // Show most recent first
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Type', 'Amount (PYUSD)', 'Balance (PYUSD)'];
    const csvContent = [
      headers.join(','),
      ...calculateRunningBalance().map(tx => [
        tx.date,
        tx.type,
        tx.amount,
        tx.balance
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transaction-history-${new Date().toISOString().split('T')[0]}.csv`);
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
        >
          <DownloadIcon className="h-4 w-4" />
          Download CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount (PYUSD)</TableHead>
              <TableHead>Balance (PYUSD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculateRunningBalance().map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell className={tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                  {tx.amount}
                </TableCell>
                <TableCell>{tx.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TransactionHistory;
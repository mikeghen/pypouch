import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const transactions = [
  {
    id: 1,
    date: "2024-02-20",
    type: "Deposit",
    amount: "+500.00",
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-02-19",
    type: "Send",
    amount: "-200.00",
    status: "Completed",
  },
  {
    id: 3,
    date: "2024-02-18",
    type: "Receive",
    amount: "+300.00",
    status: "Completed",
  },
  {
    id: 4,
    date: "2024-02-17",
    type: "Withdraw",
    amount: "-150.00",
    status: "Completed",
  },
];

const TransactionHistory = () => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount (PYUSD)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell className={tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"}>
                  {tx.amount}
                </TableCell>
                <TableCell>{tx.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TransactionHistory;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { ExternalLinkIcon } from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  type: string;
  amount: string;
  hash?: string;
}

export const TransactionTable = ({ 
  transactions,
  isLoading 
}: { 
  transactions: Transaction[];
  isLoading: boolean;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Date</TableHead>
          <TableHead className="w-[80px]">Type</TableHead>
          <TableHead className="w-[120px] text-right">Amount</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              Loading transactions...
            </TableCell>
          </TableRow>
        ) : transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
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
              <TableCell>
                {tx.hash && (
                  <a
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
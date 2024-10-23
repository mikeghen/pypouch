import { ArrowDownIcon, ArrowUpIcon, SendIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionHistory from "@/components/TransactionHistory";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} PYUSD`,
      description: "This feature will be implemented soon.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Balance Card */}
        <Card className="p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Balance</h2>
          <p className="text-4xl font-bold mt-2">1,234.56 PYUSD</p>
          <div className="mt-4 text-green-600">
            <p className="text-sm">Variable Yield</p>
            <p className="text-xl font-semibold">4.4% APY</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => handleAction("Deposit")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
          >
            <ArrowUpIcon className="h-6 w-6" />
            <span>Deposit</span>
          </Button>
          <Button
            onClick={() => handleAction("Withdraw")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
          >
            <ArrowDownIcon className="h-6 w-6" />
            <span>Withdraw</span>
          </Button>
          <Button
            onClick={() => handleAction("Send")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
          >
            <SendIcon className="h-6 w-6" />
            <span>Send</span>
          </Button>
          <Button
            onClick={() => handleAction("Receive")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
          >
            <DownloadIcon className="h-6 w-6" />
            <span>Receive</span>
          </Button>
        </div>

        {/* Transaction History */}
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Index;
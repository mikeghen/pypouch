import { ArrowDownIcon, ArrowUpIcon, SendIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionHistory from "@/components/TransactionHistory";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { useAccount, useBalance } from 'wagmi';
import { PYUSD_ADDRESS } from "@/config/wagmi";

const Index = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: PYUSD_ADDRESS
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-end">
          <WalletConnect />
        </div>

        {/* Balance Card */}
        <Card className="p-6 text-center">
          <h2 className="text-lg font-medium text-gray-600">Total Balance</h2>
          <p className="text-4xl font-bold mt-2">
            {balance ? 
              `${Number(balance.formatted).toFixed(2)} ${balance.symbol}` : 
              '0.00 PYUSD'
            }
          </p>
          <div className="mt-4 text-green-600">
            <p className="text-sm">Variable Yield</p>
            <p className="text-xl font-semibold">4.4% APY</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate("/deposit")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <ArrowUpIcon className="h-6 w-6" />
            <span>Deposit</span>
          </Button>
          <Button
            onClick={() => navigate("/withdraw")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <ArrowDownIcon className="h-6 w-6" />
            <span>Withdraw</span>
          </Button>
          <Button
            onClick={() => navigate("/send")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <SendIcon className="h-6 w-6" />
            <span>Send</span>
          </Button>
          <Button
            onClick={() => navigate("/receive")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
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
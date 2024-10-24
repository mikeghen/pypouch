import { ArrowDownIcon, ArrowUpIcon, SendIcon, DownloadIcon, WalletIcon, PiggyBankIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionHistory from "@/components/TransactionHistory";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { useAccount, useBalance } from 'wagmi';
import { PYUSD_ADDRESS } from "@/config/wagmi";
import { useAaveAPY } from "@/hooks/useAaveAPY";

const Index = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: PYUSD_ADDRESS
  });
  const apy = useAaveAPY();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PyPouch</span>
          </div>
          <WalletConnect />
        </div>

        {/* Balance Card */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* PyPouch Balance */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3">
                <PiggyBankIcon className="h-8 w-8 text-primary" />
                <div className="flex items-baseline">
                  <p className="text-4xl font-bold">
                    {balance ? Number(balance.formatted).toFixed(2) : '0.00'}
                  </p>
                  <span className="text-lg ml-1">PYUSD</span>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="text-center pt-2 border-t">
              <div className="flex items-center justify-center gap-3">
                <WalletIcon className="h-6 w-6 text-gray-500" />
                <div className="flex items-baseline">
                  <p className="text-xl font-semibold">
                    {balance ? Number(balance.formatted).toFixed(2) : '0.00'}
                  </p>
                  <span className="text-sm ml-1">PYUSD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-green-600">
            <p className="text-sm">Variable Yield</p>
            <p className="text-xl font-semibold">
              {apy ? `${apy.toFixed(2)}% APY` : 'Loading...'}
            </p>
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
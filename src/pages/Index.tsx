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
            <PiggyBankIcon className="h-6 w-6 text-primary" />
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
                <div className="flex items-baseline">
                  <p className="text-4xl font-bold">
                    {balance ? Number(balance.formatted).toFixed(2) : '0.00'}
                  </p>
                  <span className="text-lg ml-1">PYUSD</span>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                {apy ? `earning ${apy.toFixed(2)}% from Aave` : 'Loading yield rate...'}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <WalletIcon className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">
                  {balance ? `${Number(balance.formatted).toFixed(2)} PYUSD` : '0.00 PYUSD'}
                </p>
              </div>
            </div>
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

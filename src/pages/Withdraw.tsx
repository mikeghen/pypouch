import { ArrowLeftIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useBalance } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { parseUnits } from "viem";
import { useState } from "react";
import { APYUSD_ADDRESS } from "@/config/wagmi";
import { PYPOUCH_CONTRACT_ADDRESS } from "@/config/contracts";
import { useAaveAPY } from "@/hooks/useAaveAPY";
import { useWithdrawActions } from "@/hooks/useWithdrawActions";

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');

  const apy = useAaveAPY();
  const { data: pyusdBalance } = useBalance({
    address: PYPOUCH_CONTRACT_ADDRESS,
    token: APYUSD_ADDRESS
  });

  const { handleWithdraw, withdrawState } = useWithdrawActions(amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWithdraw();
  };

  const handleBalanceClick = () => {
    if (pyusdBalance) {
      setAmount(pyusdBalance.formatted);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-2">Withdraw PYUSD</h2>
          <div className="flex items-baseline mb-2">
            <p className="text-4xl font-bold">
              {pyusdBalance ? (
                <>
                  {Number(pyusdBalance.formatted).toFixed(6).slice(0, -4)}
                  <span className="text-gray-400">
                    {Number(pyusdBalance.formatted).toFixed(6).slice(-4)}
                  </span>
                </>
              ) : (
                '0.000000'
              )}
            </p>
            <span className="text-lg ml-1">aPYUSD</span>
          </div>
          {apy && (
            <p className="text-sm text-green-600 mb-6">
              Earn {apy.toFixed(2)}% APY from Aave
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount (PYUSD)
              </label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div 
                className="flex items-center justify-start gap-1 cursor-pointer hover:opacity-80"
                onClick={handleBalanceClick}
              >
                <WalletIcon className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {pyusdBalance ? `${Number(pyusdBalance.formatted).toFixed(6)} PYUSD deposited` : '0.000000 PYUSD'}
                </p>
              </div>
            </div>
            <TransactionButton
              hash={withdrawState.hash}
              isConfirming={withdrawState.isConfirming}
              isSuccess={withdrawState.isSuccess}
              isPending={withdrawState.isPending}
              action="Withdraw"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;

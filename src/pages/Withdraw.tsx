import { ArrowLeftIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useBalance, useBlockNumber } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { parseUnits } from "viem";
import { useState, useEffect } from "react";
import { TOKEN_ADDRESS, ATOKEN_ADDRESS } from "@/config/contracts";
import { useAaveAPY } from "@/hooks/useAaveAPY";
import { useWithdrawActions } from "@/hooks/useWithdrawActions";
import { usePyPouch } from '@/contexts/PyPouchContext';
import { Header } from "@/components/Header";
import { useTokenSymbols } from "@/hooks/useTokenSymbols";

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const { tokenSymbol, aTokenSymbol } = useTokenSymbols();

  const apy = useAaveAPY();
  const { pyPouchAddress } = usePyPouch();
  const { data: tokenBalance, refetch: refetchBalance } = useBalance({
    address: pyPouchAddress!,
    token: ATOKEN_ADDRESS,
  });

  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Effect to refetch balances when a new block is detected
  useEffect(() => {
    if (blockNumber) {
      refetchBalance();
    }
  }, [blockNumber, refetchBalance]);

  const { handleWithdraw, withdrawState } = useWithdrawActions(amount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWithdraw();
  };

  const handleBalanceClick = () => {
    if (tokenBalance) {
      setAmount(tokenBalance.formatted);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Header />
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
            <h2 className="text-2xl font-bold mb-2">Withdraw</h2>
            <div className="flex items-baseline mb-2">
              <p className="text-4xl font-bold">
                {tokenBalance ? (
                  <>
                    {Number(tokenBalance.formatted).toFixed(6).slice(0, -4)}
                    <span className="text-gray-400">
                      {Number(tokenBalance.formatted).toFixed(6).slice(-4)}
                    </span>
                  </>
                ) : (
                  '0.000000'
                )}
              </p>
              <span className="text-lg ml-1">{aTokenSymbol}</span>
            </div>
            {apy && (
              <p className="text-sm text-green-600 mb-6">
                Earn {apy.toFixed(2)}% APY from Aave
              </p>
            )}
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount ({tokenSymbol})
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
                    {tokenBalance ? `${Number(tokenBalance.formatted).toFixed(6)} ${tokenSymbol}` : `0.000000 ${tokenSymbol}`}
                  </p>
                </div>
              </div>
              <TransactionButton
                onClick={handleSubmit}
                hash={withdrawState.hash}
                isConfirming={withdrawState.isConfirming}
                isSuccess={withdrawState.isSuccess}
                isLoading={withdrawState.isPending}
                action="Withdraw"
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;

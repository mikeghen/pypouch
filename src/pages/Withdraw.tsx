import { ArrowLeftIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, useBalance } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyusdContractConfig } from "@/config/contracts";
import { parseUnits } from "viem";
import { useState } from "react";

const APYUSD_ADDRESS = '0x0c0d01abf3e6adfca0989ebba9d6e85dd58eab1e';

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [amount, setAmount] = useState('');

  const { data: aPYUSDBalance } = useBalance({
    address,
    token: APYUSD_ADDRESS
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWithdraw();
  };

  const handleWithdraw = () => {
    console.log('[Withdraw] Initiating withdrawal transaction');
    
    try {
      console.log('[Withdraw] Attempting to execute withdrawal');
      writeContract({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [pyusdContractConfig.address, parseUnits(amount || '0', 6)],
        account: address,
        chain: config.chains[0],
      });
      
      console.log('[Withdraw] Withdrawal toast notification shown');
    } catch (error) {
      console.error('[Withdraw] Error during withdrawal:', error);
      toast({
        title: "Withdrawal failed",
        description: "An error occurred during withdrawal.",
        variant: "destructive",
      });
    }
  };

  const handleBalanceClick = () => {
    if (aPYUSDBalance) {
      setAmount(aPYUSDBalance.formatted);
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
          <h2 className="text-2xl font-bold mb-6">Withdraw PYUSD</h2>
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
                  {aPYUSDBalance ? `${Number(aPYUSDBalance.formatted).toFixed(6)} aPYUSD available` : '0.000000 aPYUSD'}
                </p>
              </div>
            </div>
            <TransactionButton
              onClick={handleWithdraw}
              hash={hash}
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              action="Withdraw"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
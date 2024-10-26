import { ArrowLeftIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract, useConfig } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyPouchContractConfig } from "@/config/contracts";
import { parseUnits, formatUnits } from "viem";
import { useState } from "react";

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const [amount, setAmount] = useState('');

  const { writeContract: writeWithdraw, data: withdrawHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  const { data: netDeposits } = useReadContract({
    ...pyPouchContractConfig,
    functionName: 'getNetDeposits',
    args: [address!],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWithdraw();
  };

  const handleWithdraw = () => {
    try {
      writeWithdraw({
        ...pyPouchContractConfig,
        functionName: 'withdraw',
        args: [parseUnits(amount || '0', 6), address!],
        account: address,
        chain: config.chains[0],
      });
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "An error occurred during withdrawal.",
        variant: "destructive",
      });
    }
  };

  const handleBalanceClick = () => {
    if (netDeposits) {
      setAmount(formatUnits(netDeposits, 6));
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
                  {netDeposits ? `${Number(formatUnits(netDeposits, 6)).toFixed(6)} PYUSD deposited` : '0.000000 PYUSD'}
                </p>
              </div>
            </div>
            <TransactionButton
              onClick={handleWithdraw}
              hash={withdrawHash}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              isPending={isPending}
              action="Withdraw"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;

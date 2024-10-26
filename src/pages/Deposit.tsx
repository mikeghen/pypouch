import { ArrowLeftIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, useBalance, useReadContract } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyusdContractConfig, pyPouchContractConfig } from "@/config/contracts";
import { parseUnits } from "viem";
import { useState, useEffect } from "react";
import { useAaveAPY } from "@/hooks/useAaveAPY";

const Deposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const [amount, setAmount] = useState('');
  const [needsApproval, setNeedsApproval] = useState(true);
  const apy = useAaveAPY();

  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { writeContract: writeDeposit, data: depositHash, isPending: isDepositPending } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const { data: pyusdBalance } = useBalance({
    address,
    token: pyusdContractConfig.address,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...pyusdContractConfig,
    functionName: 'allowance',
    args: [address!, pyPouchContractConfig.address],
  });

  useEffect(() => {
    if (allowance !== undefined && amount) {
      setNeedsApproval(allowance < parseUnits(amount, 6));
    }
  }, [allowance, amount]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needsApproval) {
      handleApprove();
    } else {
      handleDeposit();
    }
  };

  const handleApprove = () => {
    if (isApprovePending || isApproveConfirming) return;
    
    try {
      writeApprove({
        ...pyusdContractConfig,
        functionName: 'approve',
        args: [pyPouchContractConfig.address, parseUnits(amount || '0', 6)],
        account: address,
        chain: config.chains[0],
      });
    } catch (error) {
      toast({
        title: "Approval failed",
        description: "An error occurred during approval.",
        variant: "destructive",
      });
    }
  };

  const handleDeposit = () => {
    if (isDepositPending || isDepositConfirming) return;
    
    try {
      writeDeposit({
        ...pyPouchContractConfig,
        functionName: 'deposit',
        args: [parseUnits(amount || '0', 6)],
        account: address,
        chain: config.chains[0],
      });
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: "An error occurred during deposit.",
        variant: "destructive",
      });
    }
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
          <h2 className="text-2xl font-bold mb-2">Deposit PYUSD</h2>
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
                  {pyusdBalance ? `${Number(pyusdBalance.formatted).toFixed(6)} PYUSD available` : '0.000000 PYUSD'}
                </p>
              </div>
            </div>
            {needsApproval ? (
              <TransactionButton
                onClick={handleApprove}
                hash={approveHash}
                isPending={isApprovePending}
                isConfirming={isApproveConfirming}
                isSuccess={isApproveSuccess}
                action="Approve"
              />
            ) : (
              <TransactionButton
                onClick={handleDeposit}
                hash={depositHash}
                isPending={isDepositPending}
                isConfirming={isDepositConfirming}
                isSuccess={isDepositSuccess}
                action="Deposit"
              />
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
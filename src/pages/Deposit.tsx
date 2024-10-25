import { ArrowLeftIcon, WalletIcon, PiggyBankIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, useBalance, useReadContract } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyusdContractConfig, PYPOUCH_CONTRACT_ADDRESS } from "@/config/contracts";
import { parseUnits } from "viem";
import { PYUSD_ADDRESS } from "@/config/wagmi";
import { useState, useEffect } from "react";
import { useAaveAPY } from "@/hooks/useAaveAPY";

const APYUSD_ADDRESS = '0x0c0d01abf3e6adfca0989ebba9d6e85dd58eab1e';

const Deposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const [amount, setAmount] = useState('');
  const [needsApproval, setNeedsApproval] = useState(true);
  const apy = useAaveAPY();

  const { data: aPYUSDBalance } = useBalance({
    address,
    token: APYUSD_ADDRESS
  });

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
    token: PYUSD_ADDRESS,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...pyusdContractConfig,
    functionName: 'allowance',
    args: [address!, PYPOUCH_CONTRACT_ADDRESS],
  });

  useEffect(() => {
    if (allowance !== undefined) {
      setNeedsApproval(allowance === 0n);
    }
  }, [allowance]);

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
    try {
      writeApprove({
        ...pyusdContractConfig,
        functionName: 'approve',
        args: [PYPOUCH_CONTRACT_ADDRESS, parseUnits(amount || '0', 6)],
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
    try {
      writeDeposit({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [PYPOUCH_CONTRACT_ADDRESS, parseUnits(amount || '0', 6)],
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

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Current Balance</h2>
            <PiggyBankIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline">
              <p className="text-3xl font-bold">
                {aPYUSDBalance ? Number(aPYUSDBalance.formatted).toFixed(2) : '0.00'}
              </p>
              <span className="text-lg ml-2">aPYUSD</span>
            </div>
            <p className="text-sm text-green-600">
              {apy ? `earning ${apy.toFixed(2)}% from Aave` : 'Loading yield rate...'}
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Deposit PYUSD</h2>
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
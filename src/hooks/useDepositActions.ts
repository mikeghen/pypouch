import { useEffect, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, useReadContract } from 'wagmi';
import { parseUnits } from "viem";
import { pyusdContractConfig, pyPouchContractConfig } from "@/config/contracts";
import { useToast } from "@/components/ui/use-toast";

export const useDepositActions = (amount: string) => {
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const [needsApproval, setNeedsApproval] = useState(true);

  // Approval transaction state
  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Deposit transaction state
  const { writeContract: writeDeposit, data: depositHash, isPending: isDepositPending } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  // Check allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...pyusdContractConfig,
    functionName: 'allowance',
    args: [address!, pyPouchContractConfig.address],
  });

  // Update approval status when allowance changes
  useEffect(() => {
    if (allowance !== undefined && amount) {
      try {
        const amountInBaseUnits = parseUnits(amount, 6);
        setNeedsApproval(amountInBaseUnits > allowance);
      } catch (e) {
        console.error('[Deposit] Error parsing amount:', e);
        setNeedsApproval(true);
      }
    }
  }, [allowance, amount]);

  // Refetch allowance after successful approval
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

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

  return {
    needsApproval,
    handleApprove,
    handleDeposit,
    approveState: {
      hash: approveHash,
      isPending: isApprovePending,
      isConfirming: isApproveConfirming,
      isSuccess: isApproveSuccess,
    },
    depositState: {
      hash: depositHash,
      isPending: isDepositPending,
      isConfirming: isDepositConfirming,
      isSuccess: isDepositSuccess,
    },
  };
};
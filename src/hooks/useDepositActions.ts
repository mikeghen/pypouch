import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from "viem";
import { pyusdContractConfig, pyPouchContractConfig } from "@/config/contracts";
import { useToast } from "@/components/ui/use-toast";

export const useDepositActions = (amount: string) => {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [loadingAction, setLoadingAction] = useState<'approve' | 'deposit' | null>(null);

  // Approval transaction state
  const { writeContract: writeApprove, data: approveHash } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Deposit transaction state
  const { writeContract: writeDeposit, data: depositHash } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const handleApprove = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to approve.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingAction('approve');
      writeApprove({
        ...pyusdContractConfig,
        functionName: 'approve',
        args: [pyPouchContractConfig.address, parseUnits(amount, 6)],
      });

      toast({
        title: "Approval Requested",
        description: "Please confirm the approval in your wallet",
      });
    } catch (err) {
      console.error('Approval error:', err);
      toast({
        title: "Approval Failed",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
      setLoadingAction(null);
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingAction('deposit');
      writeDeposit({
        ...pyPouchContractConfig,
        functionName: 'deposit',
        args: [parseUnits(amount, 6)],
      });

      toast({
        title: "Deposit Requested",
        description: "Please confirm the deposit in your wallet",
      });
    } catch (err) {
      console.error('Deposit error:', err);
      toast({
        title: "Deposit Failed",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
      setLoadingAction(null);
    }
  };

  // Reset loading state when transactions complete
  if (isApproveSuccess || isDepositSuccess) {
    setLoadingAction(null);
  }

  return {
    handleApprove,
    handleDeposit,
    approveState: {
      hash: approveHash,
      isConfirming: isApproveConfirming,
      isSuccess: isApproveSuccess,
    },
    depositState: {
      hash: depositHash,
      isConfirming: isDepositConfirming,
      isSuccess: isDepositSuccess,
    },
    loadingAction,
  };
};
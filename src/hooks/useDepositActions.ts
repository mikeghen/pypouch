import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig } from 'wagmi';
import { parseUnits } from "viem";
import { pyusdContractConfig, pyPouchContractConfig } from "@/config/contracts";
import { toast } from "sonner";

export const useDepositActions = (amount: string) => {
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

  // Effect to show toasts for approve transaction
  useEffect(() => {
    if (approveHash) {
      toast.loading("Approving transaction...");
    }
    if (isApproveSuccess) {
      toast.success("Approval successful! You can now deposit.");
      setNeedsApproval(false);
    }
  }, [approveHash, isApproveSuccess]);

  // Effect to show toasts for deposit transaction
  useEffect(() => {
    if (depositHash) {
      toast.loading("Depositing PYUSD...");
    }
    if (isDepositSuccess) {
      toast.success("Deposit successful!");
    }
  }, [depositHash, isDepositSuccess]);

  const handleApprove = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      writeApprove({
        ...pyusdContractConfig,
        functionName: 'approve',
        args: [pyPouchContractConfig.address, parseUnits(amount, 6)],
        chain: config.chains[0],
        account: address,
      });
    } catch (error) {
      console.error('Approval error:', error);
      toast.error("Failed to approve transaction");
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      writeDeposit({
        ...pyPouchContractConfig,
        functionName: 'deposit',
        args: [parseUnits(amount, 6)],
        chain: config.chains[0],
        account: address,
      });
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error("Failed to deposit PYUSD");
    }
  };

  return {
    needsApproval,
    handleApprove,
    handleDeposit,
    approveState: {
      hash: approveHash,
      isConfirming: isApproveConfirming,
      isSuccess: isApproveSuccess,
      isPending: isApprovePending
    },
    depositState: {
      hash: depositHash,
      isConfirming: isDepositConfirming,
      isSuccess: isDepositSuccess,
      isPending: isDepositPending
    },
  };
};
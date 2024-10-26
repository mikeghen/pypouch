import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig } from 'wagmi';
import { parseUnits } from "viem";
import { pyusdContractConfig, pyPouchContractConfig } from "@/config/contracts";
import { toast } from "sonner";

export const useDepositActions = (amount: string) => {
  const { address } = useAccount();
  const config = useConfig();
  const [needsApproval, setNeedsApproval] = useState(true);

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
      toast.error('Please enter a valid amount');
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
      setNeedsApproval(false);
    } catch (error) {
      console.error('Approval error:', error);
      toast.error('Something went wrong with the approval');
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
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
      toast.error('Something went wrong with the deposit');
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
    },
    depositState: {
      hash: depositHash,
      isConfirming: isDepositConfirming,
      isSuccess: isDepositSuccess,
    },
  };
};
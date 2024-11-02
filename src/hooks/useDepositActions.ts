import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig } from 'wagmi';
import { parseUnits } from "viem";
import { tokenContractConfig, pyPouchConfig, TOKEN_ADDRESS } from "@/config/contracts";
import { toast } from "sonner";
import { usePyPouch } from "@/contexts/PyPouchContext";

export const useDepositActions = (amount: string) => {
  const { address } = useAccount();
  const { pyPouchAddress } = usePyPouch();
  const config = useConfig();
  const [needsApproval, setNeedsApproval] = useState(true);

  // Approval transaction state
  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess, isError: isApproveError } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Deposit transaction state
  const { writeContract: writeDeposit, data: depositHash, isPending: isDepositPending } = useWriteContract();
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess, isError: isDepositError } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  // Effect to show toasts for approve transaction
  useEffect(() => {
    let loadingToast;
    console.log('Approve transaction state:', { isApprovePending, isApproveSuccess, isApproveError });
    
    if (isApprovePending) {
      console.log('Showing approval pending toast');
      loadingToast = toast.loading("Approving transaction...");
      console.log('Approval pending toast ID:', loadingToast);
    } else {
      toast.dismiss(loadingToast);
    }
    if (isApproveSuccess) {
      console.log('Showing approval success toast');
      toast.success("Approval successful! You can now deposit.", { id: loadingToast });
      console.log('Approval success toast shown with ID:', loadingToast);
      setNeedsApproval(false);
    }
    if (isApproveError) {
      console.log('Showing approval error toast');
      toast.error("Approval failed", { id: loadingToast });
      console.log('Approval error toast shown with ID:', loadingToast);
    }
  }, [isApprovePending, isApproveSuccess, isApproveError]);

  // Effect to show toasts for deposit transaction
  useEffect(() => {
    let loadingToast;
    console.log('Deposit transaction state:', { isDepositPending, isDepositSuccess, isDepositError });
    
    if (isDepositPending) {
      console.log('Showing deposit pending toast');
      loadingToast = toast.loading("Depositing PYUSD...");
      console.log('Deposit pending toast ID:', loadingToast);
    } else {
      toast.dismiss(loadingToast);
    }
    if (isDepositSuccess) {
      console.log('Showing deposit success toast');
      toast.success("Deposit successful!", { id: loadingToast });
      console.log('Deposit success toast shown with ID:', loadingToast);
    }
    if (isDepositError) {
      console.log('Showing deposit error toast');
      toast.error("Deposit failed", { id: loadingToast });
      console.log('Deposit error toast shown with ID:', loadingToast);
    }
  }, [isDepositPending, isDepositSuccess, isDepositError]);

  const handleApprove = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.log('Invalid amount for approval:', amount);
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      console.log('Initiating approval for amount:', amount);
      writeApprove({
        ...tokenContractConfig,
        address: TOKEN_ADDRESS,
        functionName: 'approve',
        args: [pyPouchAddress, parseUnits(amount, 6)],
        chain: config.chains[0],
        account: address,
      });
      console.log('Approval transaction initiated');
    } catch (error) {
      console.error('Approval error:', error);
      toast.error("Failed to approve transaction");
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.log('Invalid amount for deposit:', amount);
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      console.log('Initiating deposit for amount:', amount);
      writeDeposit({
        ...pyPouchConfig,
        address: pyPouchAddress,
        functionName: 'deposit',
        args: [parseUnits(amount, 6)],
        chain: config.chains[0],
        account: address,
      });
      console.log('Deposit transaction initiated');
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

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig } from 'wagmi';
import { parseUnits } from "viem";
import { pyPouchContractConfig } from "@/config/contracts";
import { toast } from "sonner";

export const useWithdrawActions = (amount: string) => {
  const { address } = useAccount();
  const config = useConfig();

  // Withdraw transaction state
  const { writeContract: writeWithdraw, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess, isError: isWithdrawError } = useWaitForTransactionReceipt({
    hash: withdrawHash,
  });

  // Effect to show toasts for withdraw transaction
  useEffect(() => {
    let loadingToast;
    console.log('Withdraw transaction state:', { isWithdrawPending, isWithdrawSuccess, isWithdrawError });
    
    if (isWithdrawPending) {
      console.log('Showing withdraw pending toast');
      loadingToast = toast.loading("Withdrawing PYUSD...");
      console.log('Withdraw pending toast ID:', loadingToast);
    } else {
      toast.dismiss(loadingToast);
    }
    if (isWithdrawSuccess) {
      console.log('Showing withdraw success toast');
      toast.success("Withdrawal successful!", { id: loadingToast });
      console.log('Withdraw success toast shown with ID:', loadingToast);
    }
    if (isWithdrawError) {
      console.log('Showing withdraw error toast');
      toast.error("Withdrawal failed", { id: loadingToast });
      console.log('Withdraw error toast shown with ID:', loadingToast);
    }
  }, [isWithdrawPending, isWithdrawSuccess, isWithdrawError]);

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.log('Invalid amount for withdrawal:', amount);
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      console.log('Initiating withdrawal for amount:', amount);
      writeWithdraw({
        ...pyPouchContractConfig,
        functionName: 'withdraw',
        args: [parseUnits(amount, 6), address],
        chain: config.chains[0],
        account: address,
      });
      console.log('Withdrawal transaction initiated');
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error("Failed to withdraw PYUSD");
    }
  };

  return {
    handleWithdraw,
    withdrawState: {
      hash: withdrawHash,
      isConfirming: isWithdrawConfirming,
      isSuccess: isWithdrawSuccess,
      isPending: isWithdrawPending
    },
  };
};


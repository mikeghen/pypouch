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

  // Toast notifications for approve transaction
  useEffect(() => {
    if (approveHash) {
      toast({
        title: "Approval Submitted",
        description: (
          <div className="flex flex-col gap-1">
            <span>Transaction Hash:</span>
            <a 
              href={`https://etherscan.io/tx/${approveHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              {`${approveHash.slice(0, 6)}...${approveHash.slice(-4)}`}
            </a>
          </div>
        )
      });
    }
  }, [approveHash, toast]);

  useEffect(() => {
    if (isApproveConfirming) {
      toast({
        title: "Confirming Approval",
        description: "Please wait while the approval transaction is being confirmed..."
      });
    }
  }, [isApproveConfirming, toast]);

  useEffect(() => {
    if (isApproveSuccess) {
      toast({
        title: "Approval Successful",
        description: "You can now deposit your PYUSD"
      });
    }
  }, [isApproveSuccess, toast]);

  // Toast notifications for deposit transaction
  useEffect(() => {
    if (depositHash) {
      toast({
        title: "Deposit Submitted",
        description: (
          <div className="flex flex-col gap-1">
            <span>Transaction Hash:</span>
            <a 
              href={`https://etherscan.io/tx/${depositHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              {`${depositHash.slice(0, 6)}...${depositHash.slice(-4)}`}
            </a>
          </div>
        )
      });
    }
  }, [depositHash, toast]);

  useEffect(() => {
    if (isDepositConfirming) {
      toast({
        title: "Confirming Deposit",
        description: "Please wait while your deposit is being confirmed..."
      });
    }
  }, [isDepositConfirming, toast]);

  useEffect(() => {
    if (isDepositSuccess) {
      toast({
        title: "Deposit Successful",
        description: "Your PYUSD has been successfully deposited!"
      });
    }
  }, [isDepositSuccess, toast]);

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
        title: "Approval Failed",
        description: "An error occurred during approval. Please try again.",
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
        title: "Deposit Failed",
        description: "An error occurred during deposit. Please try again.",
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
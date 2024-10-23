import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Hash } from "viem";

export const useTransactionState = (
  hash: Hash | undefined,
  isPending: boolean,
  isConfirming: boolean,
  isSuccess: boolean,
  action: string
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (hash) {
      toast({
        title: "Transaction Submitted",
        description: `${action} transaction has been submitted to the network.`
      });
    }
  }, [hash, action, toast]);

  useEffect(() => {
    if (isConfirming) {
      toast({
        title: "Confirming Transaction",
        description: "Please wait while the transaction is being confirmed..."
      });
    }
  }, [isConfirming, toast]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Transaction Successful",
        description: `${action} completed successfully!`
      });
    }
  }, [isSuccess, action, toast]);

  return {
    isLoading: isPending || isConfirming,
    buttonText: isPending ? "Confirm in Wallet..." : 
                isConfirming ? "Processing..." : 
                action
  };
};
import { Button } from "@/components/ui/button";
import { useTransactionState } from "@/hooks/useTransactionState";
import { Hash } from "viem";
import { Loader2 } from "lucide-react";

interface TransactionButtonProps {
  onClick: () => void;
  hash: Hash | undefined;
  isConfirming: boolean;
  isSuccess: boolean;
  isPending: boolean;
  action: string;
  disabled?: boolean;
}

export const TransactionButton = ({
  onClick,
  hash,
  isConfirming,
  isSuccess,
  isPending,
  action,
  disabled
}: TransactionButtonProps) => {
  const isLoading = isPending || isConfirming;
  const buttonText = isPending ? "Confirm in Wallet..." : 
                    isConfirming ? "Processing..." : 
                    action;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled || isSuccess}
      className="w-full"
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText}
    </Button>
  );
};
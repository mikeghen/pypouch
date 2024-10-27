import { Button } from "@/components/ui/button";
import { useTransactionState } from "@/hooks/useTransactionState";
import { Hash } from "viem";
import { Loader2 } from "lucide-react";

interface TransactionButtonProps {
  onClick: (e?: React.FormEvent) => void;
  hash?: `0x${string}`;
  isConfirming?: boolean;
  isSuccess?: boolean;
  isPending?: boolean;
  isLoading?: boolean;
  action: string;
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  onClick,
  hash,
  isConfirming,
  isSuccess,
  isPending,
  isLoading,
  action
}) => {
  const buttonText = isLoading ? "Confirm in Wallet..." : 
                    isConfirming ? "Processing..." : 
                    action;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText}
    </Button>
  );
};

import { Button } from "@/components/ui/button";
import { useTransactionState } from "@/hooks/useTransactionState";
import { Hash } from "viem";

interface TransactionButtonProps {
  onClick: () => void;
  hash: Hash | undefined;
  isConfirming: boolean;
  isSuccess: boolean;
  action: string;
  disabled?: boolean;
}

export const TransactionButton = ({
  onClick,
  hash,
  isConfirming,
  isSuccess,
  action,
  disabled
}: TransactionButtonProps) => {
  const { isLoading, buttonText } = useTransactionState(
    hash,
    false, // isPending is no longer used
    isConfirming,
    isSuccess,
    action
  );

  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full"
    >
      {buttonText}
    </Button>
  );
};
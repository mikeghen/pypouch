import { Button } from "@/components/ui/button";
import { useTransactionState } from "@/hooks/useTransactionState";
import { Hash } from "viem";

interface TransactionButtonProps {
  onClick: () => void;
  hash: Hash | undefined;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  action: string;
  disabled?: boolean;
}

export const TransactionButton = ({
  onClick,
  hash,
  isPending,
  isConfirming,
  isSuccess,
  action,
  disabled
}: TransactionButtonProps) => {
  const { isLoading, buttonText } = useTransactionState(
    hash,
    isPending,
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
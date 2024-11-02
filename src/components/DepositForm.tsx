import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { WalletIcon } from "lucide-react";
import { useBalance, useAccount, useReadContract, useBlockNumber } from 'wagmi';
import { tokenContractConfig, TOKEN_ADDRESS } from "@/config/contracts";
import { TransactionButton } from "@/components/TransactionButton";
import { useDepositActions } from "@/hooks/useDepositActions";
import { usePyPouch } from "@/contexts/PyPouchContext";
import { useTokenSymbols } from "@/hooks/useTokenSymbols";

export const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { pyPouchAddress } = usePyPouch();
  const { tokenSymbol } = useTokenSymbols();
  
  const { data: tokenBalance, refetch: refetchWalletBalance } = useBalance({
    address,
    token: TOKEN_ADDRESS,
  });

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const {
    needsApproval,
    handleApprove,
    handleDeposit,
    approveState,
    depositState,
  } = useDepositActions(amount);

  // Read allowance from the contract
  const { data: allowanceData } = useReadContract({
    ...tokenContractConfig,
    address: TOKEN_ADDRESS,
    functionName: "allowance",
    args: [address, pyPouchAddress],
  });

  // Determine if the allowance is sufficient
  const [isAllowanceSufficient, setIsAllowanceSufficient] = useState(false);

  useEffect(() => {
    if (allowanceData && amount) {
      const allowance = BigInt(allowanceData);
      const inputAmount = BigInt(parseFloat(amount) * 10**6); // Assuming 6 decimal places
      setIsAllowanceSufficient(allowance >= inputAmount);
    }
  }, [allowanceData, amount]);

  useEffect(() => {
    if (blockNumber) {
      refetchWalletBalance();
    }
  }, [blockNumber, refetchWalletBalance]);

  const handleBalanceClick = () => {
    if (tokenBalance) {
      setAmount(tokenBalance.formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Determine which action to show based on approval state and allowance
  const showDepositButton = isAllowanceSufficient || approveState.isSuccess;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount ({tokenSymbol})
        </label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <div 
          className="flex items-center justify-start gap-1 cursor-pointer hover:opacity-80"
          onClick={handleBalanceClick}
        >
          <WalletIcon className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-400">
            {tokenBalance ? `${Number(tokenBalance.formatted).toFixed(6)} ${tokenSymbol}` : `0.000000 ${tokenSymbol}`}
          </p>
        </div>
      </div>
      {showDepositButton ? (
        <TransactionButton
          onClick={handleDeposit}
          hash={depositState.hash}
          isConfirming={depositState.isConfirming}
          isSuccess={depositState.isSuccess}
          isLoading={depositState.isPending}
          action="Deposit"
        />
      ) : (
        <TransactionButton
          onClick={handleApprove}
          hash={approveState.hash}
          isConfirming={approveState.isConfirming}
          isSuccess={approveState.isSuccess}
          isLoading={approveState.isPending}
          action="Approve"
        />
      )}
    </form>
  );
};

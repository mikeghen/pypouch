import { useState } from "react";
import { Input } from "@/components/ui/input";
import { WalletIcon } from "lucide-react";
import { useBalance, useAccount } from 'wagmi';
import { pyusdContractConfig } from "@/config/contracts";
import { TransactionButton } from "@/components/TransactionButton";
import { useDepositActions } from "@/hooks/useDepositActions";

export const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();

  const { data: pyusdBalance } = useBalance({
    address,
    token: pyusdContractConfig.address,
  });

  const {
    needsApproval,
    handleApprove,
    handleDeposit,
    approveState,
    depositState,
  } = useDepositActions(amount);

  const handleBalanceClick = () => {
    if (pyusdBalance) {
      setAmount(pyusdBalance.formatted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Determine which action to show based on approval state
  const showDepositButton = !needsApproval || approveState.isSuccess;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount (PYUSD)
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
            {pyusdBalance ? `${Number(pyusdBalance.formatted).toFixed(6)} PYUSD available` : '0.000000 PYUSD'}
          </p>
        </div>
      </div>
      {showDepositButton ? (
        <TransactionButton
          onClick={handleDeposit}
          hash={depositState.hash}
          isConfirming={depositState.isConfirming}
          isSuccess={depositState.isSuccess}
          isPending={depositState.isPending}
          action="Deposit"
        />
      ) : (
        <TransactionButton
          onClick={handleApprove}
          hash={approveState.hash}
          isConfirming={approveState.isConfirming}
          isSuccess={approveState.isSuccess}
          isPending={approveState.isPending}
          action="Approve"
        />
      )}
    </form>
  );
};
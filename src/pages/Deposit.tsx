import { ArrowLeftIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, useBalance } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyusdContractConfig } from "@/config/contracts";
import { parseUnits } from "viem";
import { PYUSD_ADDRESS } from "@/config/wagmi";

const Deposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: pyusdBalance } = useBalance({
    address,
    token: PYUSD_ADDRESS,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDeposit();
  };

  const handleDeposit = () => {
    console.log('[Deposit] Initiating deposit transaction');
    
    try {
      console.log('[Deposit] Attempting to execute deposit');
      writeContract({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [pyusdContractConfig.address, parseUnits('0', 6)],
        account: address,
        chain: config.chains[0],
      });
      
      console.log('[Deposit] Deposit toast notification shown');
    } catch (error) {
      console.error('[Deposit] Error during deposit:', error);
      toast({
        title: "Deposit failed",
        description: "An error occurred during deposit.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Deposit PYUSD</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount (PYUSD)
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
              <div 
                className="flex items-center justify-start gap-1 cursor-pointer hover:opacity-80"
              >
                <WalletIcon className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-400">
                  {pyusdBalance ? `${Number(pyusdBalance.formatted).toFixed(6)} PYUSD available` : '0.000000 PYUSD'}
                </p>
              </div>
            </div>
            <TransactionButton
              onClick={handleDeposit}
              hash={hash}
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              action="Deposit"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
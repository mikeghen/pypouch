import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyusdContractConfig } from "@/config/contracts";
import { parseUnits } from 'viem';

const Withdraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWithdraw();
  };

  const handleWithdraw = () => {
    console.log('[Withdraw] Initiating withdrawal transaction');
    
    try {
      console.log('[Withdraw] Attempting to execute withdrawal');
      writeContract({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [pyusdContractConfig.address, parseUnits('0', 6)], // Example withdrawal, adjust as needed
      });
      
      console.log('[Withdraw] Withdrawal toast notification shown');
    } catch (error) {
      console.error('[Withdraw] Error during withdrawal:', error);
      toast({
        title: "Withdrawal failed",
        description: "An error occurred during withdrawal.",
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
          <h2 className="text-2xl font-bold mb-6">Withdraw PYUSD</h2>
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
            </div>
            <TransactionButton
              onClick={handleWithdraw}
              hash={hash}
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              action="Withdraw"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
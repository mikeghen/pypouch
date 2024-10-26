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
import { useState } from "react";
import { PYUSD_ADDRESS } from "@/config/wagmi";

const Send = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address } = useAccount();
  const config = useConfig();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const { data: pyusdBalance } = useBalance({
    address,
    token: PYUSD_ADDRESS,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleSend = () => {
    console.log('[Send] Initiating send transaction');
    
    if (!amount || !recipientAddress) return;

    try {
      console.log('[Send] Attempting to execute send');
      writeContract({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, parseUnits(amount, 6)],
        account: address,
        chain: config.chains[0],
      });
      
      console.log('[Send] Send toast notification shown');
    } catch (error) {
      console.error('[Send] Error during send:', error);
      toast({
        title: "Send failed",
        description: "An error occurred during send.",
        variant: "destructive",
      });
    }
  };

  const handleBalanceClick = () => {
    if (pyusdBalance) {
      setAmount(pyusdBalance.formatted);
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
          <h2 className="text-2xl font-bold mb-6">Send PYUSD</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium">
                Recipient Address
              </label>
              <Input
                id="recipient"
                type="text"
                placeholder="Enter recipient address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                required
              />
            </div>
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
            <TransactionButton
              onClick={handleSend}
              hash={hash}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              isPending={isPending}
              action="Send"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Send;

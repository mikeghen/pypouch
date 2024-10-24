import { ArrowLeftIcon, ScanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import QrScanner from "react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { PYUSD_ADDRESS } from "@/config/wagmi";
import { pyusdContractConfig } from "@/config/contracts";
import { TransactionButton } from "@/components/TransactionButton";

const Send = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
    token: PYUSD_ADDRESS
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleSend = async () => {
    console.log('[Send] Initiating send transaction', {
      from: address,
      to: recipientAddress,
      amount,
      balance: balance?.formatted
    });

    if (!address) {
      console.error('[Send] Wallet not connected');
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('[Send] Converting amount to units');
      const value = parseUnits(amount, 6);
      console.log('[Send] Parsed amount:', value.toString());

      console.log('[Send] Calling transfer contract');
      writeContract({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, value],
        account: address,
      });
      
      console.log('[Send] Transfer contract call successful');
    } catch (error) {
      console.error('[Send] Error during send:', error);
      toast({
        title: "Error",
        description: "Failed to send PYUSD",
        variant: "destructive",
      });
    }
  };

  const handleScan = (data: { text: string } | null) => {
    console.log('[Send] QR scan result:', data);
    if (data) {
      setRecipientAddress(data.text);
      setShowScanner(false);
      console.log('[Send] Address set from QR:', data.text);
      toast({
        title: "Address scanned",
        description: "QR code successfully scanned",
      });
    }
  };

  const handleError = (err: any) => {
    console.error('[Send] QR scan error:', err);
    toast({
      title: "Scan failed",
      description: "Failed to scan QR code. Please try again.",
      variant: "destructive",
    });
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
              <div className="flex gap-2">
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient address"
                  required
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowScanner(true)}
                >
                  <ScanIcon className="h-4 w-4" />
                </Button>
              </div>
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
                step="0.000001"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {balance && (
                <p className="text-sm text-gray-500">
                  Balance: {Number(balance.formatted).toFixed(6)} {balance.symbol}
                </p>
              )}
            </div>
            <TransactionButton
              onClick={handleSend}
              hash={hash}
              isPending={isPending}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              action="Send"
              disabled={!address}
            />
          </form>
        </Card>
      </div>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <QrScanner
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Send;

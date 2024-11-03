import { ArrowLeftIcon, WalletIcon, ScanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, useBalance } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { pyusdContractConfig } from "@/config/contracts";
import { parseUnits } from "viem";
import { useState, useEffect } from "react";
import { PYUSD_ADDRESS } from "@/config/wagmi";
import QrScanner from 'react-qr-scanner';
import { Header } from "@/components/Header";
import { toast } from "sonner";

const Send = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const config = useConfig();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const { data: pyusdBalance } = useBalance({
    address,
    token: PYUSD_ADDRESS,
  });

  useEffect(() => {
    let loadingToast;
    console.log('Send transaction state:', { isPending, isSuccess, isError: !isSuccess && !isPending && hash });
    
    if (isPending) {
      console.log('Showing send pending toast');
      loadingToast = toast.loading("Sending PYUSD...");
      console.log('Send pending toast ID:', loadingToast);
    } else {
      toast.dismiss(loadingToast);
    }
    if (isSuccess) {
      console.log('Showing send success toast');
      toast.success("Send successful!", { id: loadingToast });
      console.log('Send success toast shown with ID:', loadingToast);
    }
    if (!isSuccess && !isPending && hash) {
      console.log('Showing send error toast');
      toast.error("Send failed", { id: loadingToast });
      console.log('Send error toast shown with ID:', loadingToast);
    }
  }, [isPending, isSuccess, hash]);

  const handleSend = async () => {
    console.log('[Send] Initiating send transaction');
    
    if (!amount || !recipientAddress) {
      toast.error("Invalid Input", {
        description: "Please enter both amount and recipient address",
      });
      return;
    }

    try {
      console.log('[Send] Attempting to execute send');
      writeContract({
        ...pyusdContractConfig,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, parseUnits(amount, 6)],
        account: address,
        chain: config.chains[0],
      });
      
      console.log('[Send] Send transaction initiated');
    } catch (error) {
      console.error('[Send] Error during send:', error);
      toast.error("Send failed", {
        description: error instanceof Error ? error.message : "An error occurred during send."
      });
    }
  };

  const handleBalanceClick = () => {
    if (pyusdBalance) {
      setAmount(pyusdBalance.formatted);
    }
  };

  const handleScan = (result: any) => {
    if (result) {
      setRecipientAddress(result.text);
      setShowScanner(false);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    toast.error("Scan failed", {
      description: "Failed to scan QR code."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Header />
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

            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipient" className="text-sm font-medium">
                  Recipient Address
                </label>
                <div className="relative">
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="Enter recipient address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
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
              {showScanner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg w-full max-w-sm">
                    <h3 className="text-lg font-medium mb-4">Scan QR Code</h3>
                    <div className="relative aspect-square w-full">
                      <QrScanner
                        onScan={handleScan}
                        onError={handleError}
                        style={{ width: '100%' }}
                        constraints={{
                          video: { facingMode: 'environment' }
                        }}
                      />
                    </div>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => setShowScanner(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <TransactionButton
                onClick={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                hash={hash}
                isConfirming={isConfirming}
                isSuccess={isSuccess}
                isLoading={isPending}
                action="Send"
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Send;

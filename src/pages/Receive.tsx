import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useAccount } from 'wagmi';
import { WalletConnect } from "@/components/WalletConnect";

const Receive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { address } = useAccount();

  const handleCopy = async () => {
    console.log('[Receive] Attempting to copy address:', address);
    if (!address) {
      console.warn('[Receive] No address available to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(address);
      console.log('[Receive] Address copied successfully');
      setCopied(true);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => {
        console.log('[Receive] Resetting copy state');
        setCopied(false)
      }, 2000);
    } catch (err) {
      console.error('[Receive] Failed to copy address:', err);
      toast({
        title: "Failed to copy",
        description: "Please try copying manually",
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
          <h2 className="text-2xl font-bold mb-6">Receive PYUSD</h2>
          {!address ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Connect your wallet to receive PYUSD</p>
              <WalletConnect />
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                Scan QR code or share your wallet address to receive PYUSD
              </p>
              
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCodeSVG
                  value={address}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-gray-100 rounded-lg text-sm break-all">
                    {address}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Receive;
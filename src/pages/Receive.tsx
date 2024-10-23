import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

const Receive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
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
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Scan QR code or share your wallet address to receive PYUSD
            </p>
            
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeSVG
                value={walletAddress}
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
                  {walletAddress}
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
        </Card>
      </div>
    </div>
  );
};

export default Receive;
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Receive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const walletAddress = "0x1234...5678"; // This would be fetched from your wallet state

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
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
          <h2 className="text-2xl font-bold mb-6">Receive PYUSD</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Share your wallet address to receive PYUSD
            </p>
            <div className="p-4 bg-gray-100 rounded-lg break-all">
              {walletAddress}
            </div>
            <Button onClick={handleCopy} className="w-full">
              Copy Address
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Receive;
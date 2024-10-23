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

const Send = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Transfer initiated",
      description: "This feature will be implemented soon.",
    });
  };

  const handleScan = (data: { text: string } | null) => {
    if (data) {
      setRecipientAddress(data.text);
      setShowScanner(false);
      toast({
        title: "Address scanned",
        description: "QR code successfully scanned",
      });
    }
  };

  const handleError = (err: any) => {
    console.error(err);
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
          <form onSubmit={handleSend} className="space-y-4">
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
                step="0.01"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Send
            </Button>
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
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Deposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Deposit] Initiating deposit transaction');
    
    try {
      console.log('[Deposit] Attempting to execute deposit');
      // Future deposit implementation will go here
      toast({
        title: "Deposit initiated",
        description: "This feature will be implemented soon.",
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
          <form onSubmit={handleDeposit} className="space-y-4">
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
              Deposit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
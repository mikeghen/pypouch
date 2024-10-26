import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAaveAPY } from "@/hooks/useAaveAPY";
import { DepositForm } from "@/components/DepositForm";

const Deposit = () => {
  const navigate = useNavigate();
  const apy = useAaveAPY();

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
          <h2 className="text-2xl font-bold mb-2">Deposit PYUSD</h2>
          {apy && (
            <p className="text-sm text-green-600 mb-6">
              Earn {apy.toFixed(2)}% APY from Aave
            </p>
          )}
          <DepositForm />
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
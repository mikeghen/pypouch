import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAaveAPY } from "@/hooks/useAaveAPY";
import { DepositForm } from "@/components/DepositForm";
import { useBalance } from 'wagmi';
import { APYUSD_ADDRESS } from "@/config/wagmi";
import { PYPOUCH_CONTRACT_ADDRESS } from "@/config/contracts";

const Deposit = () => {
  const navigate = useNavigate();
  const apy = useAaveAPY();
  const { data: pyusdBalance } = useBalance({
    address: PYPOUCH_CONTRACT_ADDRESS,
    token: APYUSD_ADDRESS
  });

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
          <div className="flex items-baseline mb-2">
            <p className="text-4xl font-bold">
              {pyusdBalance ? Number(pyusdBalance.formatted).toFixed(2) : '0.00'}
            </p>
            <span className="text-lg ml-1">aPYUSD</span>
          </div>
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

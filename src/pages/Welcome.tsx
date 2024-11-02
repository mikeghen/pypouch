import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { pyPouchFactoryConfig, TOKEN_ADDRESS, ATOKEN_ADDRESS } from "@/config/contracts";
import { usePyPouch } from '@/contexts/PyPouchContext';
import { PiggyBankIcon, Loader2 } from "lucide-react";
import {  } from "@/config/contracts";
import { aavePoolConfig } from "@/config/contracts";
import { toast } from "sonner";
import { TransactionButton } from "@/components/TransactionButton";
import { mainnet } from 'wagmi/chains';

const Welcome = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { setPyPouchAddress } = usePyPouch();

  // Read PyPouch address
  const { data: pyPouchData } = useReadContract({
    address: pyPouchFactoryConfig.address,
    abi: pyPouchFactoryConfig.abi,
    functionName: 'getPyPouchAddress',
    args: [address!]
  });

  // Write contract state
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  // Effect to handle transaction states with toasts
  useEffect(() => {
    let loadingToast;
    
    if (isPending) {
      loadingToast = toast.loading("Please confirm the transaction in your wallet...");
    } else {
      toast.dismiss(loadingToast);
    }

    if (isConfirming) {
      loadingToast = toast.loading("Creating your PyPouch...");
    }

    if (isSuccess) {
      toast.success("PyPouch created successfully!");
    }

    if (isError) {
      toast.error("Failed to create PyPouch");
    }
  }, [isPending, isConfirming, isSuccess, isError]);

  // Effect to handle navigation after PyPouch creation
  useEffect(() => {
    if (pyPouchData && pyPouchData !== '0x0000000000000000000000000000000000000000') {
      setPyPouchAddress(pyPouchData);
      navigate('/');
    }
  }, [pyPouchData, navigate, setPyPouchAddress]);

  const handleCreatePyPouch = async () => {
    if (!address) return;
    
    try {
      writeContract({
        address: pyPouchFactoryConfig.address,
        abi: pyPouchFactoryConfig.abi,
        functionName: 'createPyPouch',
        args: [
          TOKEN_ADDRESS,
          ATOKEN_ADDRESS,
          aavePoolConfig.address
        ],
        chain: mainnet,
        account: address
      });
    } catch (error) {
      console.error('Failed to create PyPouch:', error);
      toast.error("Failed to create PyPouch");
    }
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PiggyBankIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PyPouch</span>
          </div>
          <WalletConnect />
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to PyPouch</h2>
          <p className="text-gray-600 mb-6">
            Create your personal PyPouch to start earning yield on your PYUSD deposits through Aave.
          </p>

          {!address ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">Connect your wallet to get started</p>
              <WalletConnect />
            </div>
          ) : (
            <TransactionButton
              onClick={handleCreatePyPouch}
              hash={hash}
              isConfirming={isConfirming}
              isSuccess={isSuccess}
              isLoading={isPending}
              action="Create PyPouch"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Welcome;

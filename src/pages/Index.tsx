import { ArrowDownIcon, ArrowUpIcon, SendIcon, DownloadIcon, PiggyBankIcon, WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TransactionHistory from "@/components/TransactionHistory";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import { useAccount, useBalance } from 'wagmi';
import { useAaveAPY } from "@/hooks/useAaveAPY";
import { PYUSD_ADDRESS, APYUSD_ADDRESS } from "@/config/wagmi";
import { useContractRead } from 'wagmi';
import { pyPouchFactoryConfig } from "@/config/contracts";
import { usePyPouch } from '@/contexts/PyPouchContext';
import { usePublicClient } from 'wagmi';
import { TransactionButton } from "@/components/TransactionButton";
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { aavePoolConfig } from "@/config/contracts";
import { toast } from "sonner";
import { mainnet } from "wagmi/chains";

const Index = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { pyPouchAddress, setPyPouchAddress } = usePyPouch();
  const publicClient = usePublicClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  // Read the PyPouch address for the connected user
  const { data: pyPouchData } = useContractRead({
    ...pyPouchFactoryConfig,
    functionName: 'getPyPouchAddress',
    args: [address!],
  });

  useEffect(() => {
    const checkAndSetPyPouch = async () => {
      if (pyPouchData && pyPouchData !== '0x0000000000000000000000000000000000000000' && pyPouchAddress !== pyPouchData) {
        // Check if address has code
        const code = await publicClient.getBytecode({ address: pyPouchData as `0x${string}` });
        
        // If no code exists at the address, set to special address, otherwise set to pyPouchData
        const addressToSet = code ? pyPouchData : '0x000000000000000000000000000000000000000A';
        setPyPouchAddress(addressToSet as `0x${string}`);
      }
    };

    checkAndSetPyPouch();
  }, [pyPouchData, setPyPouchAddress, publicClient, pyPouchAddress]);

  const { data: aPYUSDBalance } = useBalance({
    address: pyPouchAddress!,
    token: APYUSD_ADDRESS,
  });
  const { data: pyusdBalance } = useBalance({
    address,
    token: PYUSD_ADDRESS
  });
  const apy = useAaveAPY();

  // Add transaction state effect
  useEffect(() => {
    let loadingToast;
    
    if (isPending) {
      loadingToast = toast.loading("Please confirm the transaction in your wallet...");
    } else {
      toast.dismiss(loadingToast);
    }

    if (isLoading) {
      loadingToast = toast.loading("Creating your PyPouch...");
    }

    if (isSuccess) {
      toast.success("PyPouch created successfully!");
    }

    if (isError) {
      toast.error("Failed to create PyPouch");
    }
  }, [isPending, isLoading, isSuccess, isError]);

  const handleCreatePyPouch = async () => {
    if (!address) return;
    
    try {
      writeContract({
        address: pyPouchFactoryConfig.address,
        abi: pyPouchFactoryConfig.abi,
        functionName: 'createPyPouch',
        args: [
          PYUSD_ADDRESS,
          APYUSD_ADDRESS,
          aavePoolConfig.address
        ],
        account: address,
        chain: mainnet
      });
    } catch (error) {
      console.error('Failed to create PyPouch:', error);
      toast.error("Failed to create PyPouch");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PiggyBankIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">PyPouch</span>
          </div>
          <WalletConnect />
        </div>

        {/* Add PyPouch Creation Card */}
        {pyPouchAddress === '0x000000000000000000000000000000000000000A' && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Create Your PyPouch</h2>
            <p className="text-gray-600 mb-6">
              Create your personal PyPouch to start earning yield on your PYUSD deposits through Aave.
            </p>
            <TransactionButton
              onClick={handleCreatePyPouch}
              hash={hash}
              isConfirming={isLoading}
              isSuccess={isSuccess}
              isPending={isPending}
              action="Create PyPouch"
            />
          </Card>
        )}

        {/* Existing Balance Card */}
        {pyPouchAddress !== '0x000000000000000000000000000000000000000A' && (
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spending Account (PYUSD Wallet Balance) */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Spending</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {pyusdBalance ? Number(pyusdBalance.formatted).toFixed(2) : '0.00'}
                  </span>
                  <span className="text-lg ml-2 text-gray-600">PYUSD</span>
                </div>
                <div className="flex items-center gap-1">
                  <WalletIcon className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-400">Available in wallet</p>
                </div>
              </div>

              {/* Savings Account (Aave Balance) */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Savings</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {aPYUSDBalance ? (
                      <>
                        {Number(aPYUSDBalance.formatted).toFixed(2)}
                        <span className="text-gray-400">
                          {Number(aPYUSDBalance.formatted).toFixed(6).slice(-4)}
                        </span>
                      </>
                    ) : '0.000000'}
                  </span>
                  <span className="text-lg ml-2 text-gray-600">PYUSD</span>
                </div>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <PiggyBankIcon className="h-4 w-4" />
                  {apy ? `Earning ${apy.toFixed(2)}% APY` : 'Loading yield rate...'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate("/deposit")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <ArrowUpIcon className="h-6 w-6" />
            <span>Deposit</span>
          </Button>
          <Button
            onClick={() => navigate("/withdraw")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <ArrowDownIcon className="h-6 w-6" />
            <span>Withdraw</span>
          </Button>
          <Button
            onClick={() => navigate("/send")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <SendIcon className="h-6 w-6" />
            <span>Send</span>
          </Button>
          <Button
            onClick={() => navigate("/receive")}
            className="flex flex-col items-center gap-2 h-auto py-4"
            variant="outline"
            disabled={!address}
          >
            <DownloadIcon className="h-6 w-6" />
            <span>Receive</span>
          </Button>
        </div>

        {/* Transaction History */}
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Index;

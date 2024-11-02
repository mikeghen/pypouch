import { useReadContract } from 'wagmi';
import { aavePoolConfig, TOKEN_ADDRESS } from '@/config/contracts';

type ReserveData = {
  configuration: { data: bigint };
  liquidityIndex: bigint;
  currentLiquidityRate: bigint;
};

export const useAaveAPY = () => {
  const { data } = useReadContract({
    ...aavePoolConfig,
    functionName: 'getReserveData',
    args: [TOKEN_ADDRESS],
  });

  if (!data) return null;

  // Convert RAY (27 decimals) to percentage
  const reserveData = data as ReserveData;
  const liquidityRate = Number(reserveData.currentLiquidityRate);
  const APY = liquidityRate * 100 / 1e27;

  return APY;
};
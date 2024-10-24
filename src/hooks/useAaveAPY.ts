import { useReadContract } from 'wagmi';
import { aavePoolConfig, PYUSD_ADDRESS } from '@/config/contracts';

export const useAaveAPY = () => {
  const { data: reserveData } = useReadContract({
    ...aavePoolConfig,
    functionName: 'getReserveData',
    args: [PYUSD_ADDRESS],
  });

  if (!reserveData) return null;

  // Convert RAY (27 decimals) to percentage
  const liquidityRate = Number(reserveData.currentLiquidityRate);
  const APY = (liquidityRate / 1e27) * 100;

  return APY;
};
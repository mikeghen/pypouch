import { useReadContract } from 'wagmi';
import { ATOKEN_ADDRESS, TOKEN_ADDRESS, tokenContractConfig } from '@/config/contracts';

export const useTokenSymbols = () => {
  const { data: tokenSymbol } = useReadContract({
    ...tokenContractConfig,
    address: TOKEN_ADDRESS,
    functionName: 'symbol',
  });

  const { data: aTokenSymbol } = useReadContract({
    ...tokenContractConfig,
    address: ATOKEN_ADDRESS,
    functionName: 'symbol',
  });

  return {
    tokenSymbol: tokenSymbol || 'TOKEN',
    aTokenSymbol: aTokenSymbol || 'aTOKEN'
  };
};

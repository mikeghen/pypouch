import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet, Chain } from 'wagmi/chains';
import { http } from 'viem';

const rpcUrl = import.meta.env.VITE_PUBLIC_RPC_URL as string;
const chainName = import.meta.env.VITE_WAGMI_CHAIN as string;

if (!rpcUrl) {
  throw new Error('VITE_PUBLIC_RPC_URL environment variable is not set');
}

if (!chainName) {
  throw new Error('VITE_WAGMI_CHAIN environment variable is not set');
}

// Get the chain configuration based on environment variable
const getChainConfig = (): Chain => {
  switch (chainName.toLowerCase()) {
    case 'base':
      return base;
    case 'mainnet':
      return mainnet;
    // Add more chains as needed
    default:
      throw new Error(`Unsupported chain: ${chainName}`);
  }
};

// Configure the chain with custom RPC URL
const configuredNetwork = {
  ...getChainConfig(),
  rpcUrls: {
    ...getChainConfig().rpcUrls,
    default: {
      http: [rpcUrl],
    },
    public: {
      http: [rpcUrl],
    },
  },
};

export const wagmiConfig = getDefaultConfig({
  appName: 'PyPouch',
  projectId: "21fef48091f12692cad574a6f7753643",
  chains: [configuredNetwork],
  transports: {
    [configuredNetwork.id]: http(rpcUrl)
  },
  ssr: false,
});

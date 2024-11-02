import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { http } from 'viem';

const rpcUrl = import.meta.env.VITE_PUBLIC_RPC_URL as string;

if (!rpcUrl) {
  throw new Error('VITE_PUBLIC_RPC_URL environment variable is not set');
}

// Configure the mainnet chain with custom RPC URL
const configuredMainnet = {
  ...mainnet,
  rpcUrls: {
    ...mainnet.rpcUrls,
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
  chains: [configuredMainnet],
  transports: {
    [configuredMainnet.id]: http(rpcUrl)
  },
  ssr: false,
});

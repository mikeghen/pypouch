import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { http } from 'viem';

// Using Ankr's public RPC endpoint instead
const rpcUrl = "https://rpc.ankr.com/eth";

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
  appName: 'PYUSD Pouch',
  projectId: "21fef48091f12692cad574a6f7753643",
  chains: [configuredMainnet],
  transports: {
    [configuredMainnet.id]: http(rpcUrl)
  },
  ssr: false,
});

export const PYUSD_ADDRESS = '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8';

export const PYUSD_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const;
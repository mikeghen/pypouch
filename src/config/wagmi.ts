import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'PYUSD Pouch',
  projectId: 'YOUR_PROJECT_ID', // You'll need to get this from WalletConnect
  chains: [mainnet],
  ssr: false,
});

export const PYUSD_ADDRESS = '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8';

export const PYUSD_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const;
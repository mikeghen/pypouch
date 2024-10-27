import { PublicClient } from 'viem';
import { PYUSD_ADDRESS } from "@/config/wagmi";
import { PYPOUCH_CONTRACT_ADDRESS } from "@/config/contracts";

export const fetchTransferLogs = async (
  publicClient: PublicClient,
  address: `0x${string}`,
  fromBlock: bigint,
  toBlock: bigint
) => {
  return Promise.all([
    publicClient.getLogs({
      address: PYUSD_ADDRESS,
      event: {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { type: 'address', name: 'from', indexed: true },
          { type: 'address', name: 'to', indexed: true },
          { type: 'uint256', name: 'value' },
        ],
      },
      args: { from: address },
      fromBlock,
      toBlock
    }),
    publicClient.getLogs({
      address: PYUSD_ADDRESS,
      event: {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { type: 'address', name: 'from', indexed: true },
          { type: 'address', name: 'to', indexed: true },
          { type: 'uint256', name: 'value' },
        ],
      },
      args: { to: address },
      fromBlock,
      toBlock
    }),
    publicClient.getLogs({
      address: PYPOUCH_CONTRACT_ADDRESS,
      event: {
        type: 'event', 
        name: 'YieldEarned',
        inputs: [
          { type: 'address', name: 'user', indexed: true },
          { type: 'uint256', name: 'yield' },
        ],
      },
      args: { user: address },
      fromBlock,
      toBlock
    })
  ]);
};

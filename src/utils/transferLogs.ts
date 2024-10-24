import { PublicClient } from 'viem';
import { PYUSD_ADDRESS } from "@/config/wagmi";

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
    })
  ]);
};
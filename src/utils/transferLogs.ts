import { PublicClient } from 'viem';
import { TOKEN_ADDRESS } from "@/config/contracts";
import {   } from '@/contexts/PyPouchContext';

interface TransferLogsProps {
  publicClient: PublicClient;
  address: `0x${string}`;
  fromBlock: bigint;
  toBlock: bigint;
  pyPouchAddress: string;
}

export const fetchTransferLogs = async ({
  publicClient,
  address,
  fromBlock,
  toBlock,
  pyPouchAddress
}: TransferLogsProps) => {
  console.log('Fetching transfer logs with params:', {
    address,
    fromBlock: fromBlock.toString(),
    toBlock: toBlock.toString(),
    pyPouchAddress
  });

  try {
    console.log('Fetching outgoing PYUSD transfers...');
    const outgoingTransfers = await publicClient.getLogs({
      address: TOKEN_ADDRESS,
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
    });
    console.log('Outgoing transfers:', outgoingTransfers);

    console.log('Fetching incoming PYUSD transfers...');
    const incomingTransfers = await publicClient.getLogs({
      address: TOKEN_ADDRESS,
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
    });
    console.log('Incoming transfers:', incomingTransfers);

    console.log('Fetching yield earned events...');
    const yieldEvents = await publicClient.getLogs({
      address: pyPouchAddress as `0x${string}`, // Type assertion to fix type error
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
    });
    console.log('Yield events:', yieldEvents);

    return [outgoingTransfers, incomingTransfers, yieldEvents];
  } catch (error) {
    console.error('Error fetching transfer logs:', error);
    throw error;
  }
};

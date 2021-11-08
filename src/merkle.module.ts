import { MerkleTree } from './merkle';
import { MerkleProvider } from './merkle.provider';

export const createMerkleTree = (
  data: Array<string>,
  implementation?: string,
): MerkleTree => {
  return MerkleProvider(implementation, data);
};

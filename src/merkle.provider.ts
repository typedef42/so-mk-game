import { MerkleTreeRecursive } from './recursive/merkle.recursive';

export const MerkleProvider = (implementation: string, data: Array<string>) => {
  implementation = implementation ?? '';

  switch (implementation.toLowerCase()) {
    default:
    case 'recursive':
      return new MerkleTreeRecursive(data);
  }
};

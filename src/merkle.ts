export type MerkleNode = {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
};

export interface MerkleTree {
  root(): string;
  height(): number;
  level(index: number): Array<string>;
  checkIntegrity(data: string): boolean;
  print();
}

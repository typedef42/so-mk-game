import * as crypto from 'crypto';

import { MerkleNode, MerkleTree } from 'src/merkle';

export class MerkleTreeRecursive implements MerkleTree {
  private rootNode: MerkleNode;
  private leavesCache: Map<string, MerkleNode>;

  constructor(datas: Array<string>) {
    this._initTree(datas);
  }

  /**
   * Retrieve the root node hash of the Merkle tree
   *
   * @returns {string} - hex string hash
   */
  root(): string {
    return this.rootNode.hash;
  }

  /**
   * Retrieve the maximum height of the Merkle tree
   *
   * @returns {number} - Max height of the tree
   */
  height(): number {
    return this._computeHeight(this.rootNode);
  }

  /**
   * Retrieve all the hashes of a given level of the Merkle tree
   *
   * @param {number} index - index of the level to retrieve
   * @returns {Array<string>} - hashes of the given level
   */
  level(index: number): Array<string> {
    let targetNodes: Array<string> = [];
    let currentDepth = 1;

    this._computeLevel(this.rootNode, index, currentDepth, targetNodes);
    return targetNodes;
  }

  /**
   * Print the entire Merkle tree hashes
   */
  print() {
    this._printNode(this.rootNode, 1);
  }

  /**
   * Check if the given data is part of the tree or not
   *
   * @param {string} data - raw data to check
   * @returns {boolean} - true when data is part of the tree
   */
  checkIntegrity(data: string): boolean {
    return this.leavesCache.has(
      crypto.createHash('sha256').update(data).digest('hex'),
    );
  }

  private _printNode(node: MerkleNode, currentDepth: number) {
    if (!node) {
      return;
    }

    const offset = Array.from(Array(currentDepth - 1), () => '\t').join('');
    console.log(`${offset}${node.hash}`);
    this._printNode(node.left, currentDepth + 1);
    this._printNode(node.right, currentDepth + 1);
  }

  private _computeLevel(
    node: MerkleNode,
    index: number,
    currentDepth: number,
    currentNodes: Array<string>,
  ) {
    if (!node) {
      return;
    }

    if (index === currentDepth) {
      currentNodes.push(node.hash);
      return;
    }

    if (currentDepth < index) {
      this._computeLevel(node.left, index, currentDepth + 1, currentNodes);
      this._computeLevel(node.right, index, currentDepth + 1, currentNodes);
    }
  }

  private _computeHeight(node: MerkleNode): number {
    if (!node) {
      return 0;
    }
    return (
      1 +
      Math.max(this._computeHeight(node.left), this._computeHeight(node.right))
    );
  }

  private _initTree(datas: Array<string>) {
    let leaves: Array<MerkleNode> = [];

    for (let data of datas) {
      leaves.push({
        hash: crypto.createHash('sha256').update(data).digest('hex'),
      });
    }
    this.leavesCache = new Map(leaves.map((node) => [node.hash, node]));
    this._buildTreeLevel(leaves);
  }

  private _buildTreeLevel(nodes: Array<MerkleNode>) {
    let newLevelNodes: Array<MerkleNode> = [];

    if (nodes.length <= 1) {
      this.rootNode = nodes[0];
    } else {
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = nodes[i + 1];

        if (!right) {
          newLevelNodes.push({ hash: left.hash, left });
        } else {
          newLevelNodes.push({
            hash: crypto
              .createHash('sha256')
              .update(`${left.hash}${right.hash}`)
              .digest('hex'),
            left,
            right,
          });
        }
      }

      this._buildTreeLevel(newLevelNodes);
    }
  }
}

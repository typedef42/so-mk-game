import * as crypto from 'crypto';

import { createMerkleTree } from '../merkle.module';
import { MerkleTreeRecursive } from './merkle.recursive';

describe('MerkleTree', () => {
  describe('Given an array of data string...', () => {
    const datas = ['lorem', 'ipsum', 'is', 'just', 'a', 'dummy'];

    it('should build a MerkleTree', () => {
      const tree = createMerkleTree(datas);

      expect(tree).toBeInstanceOf(MerkleTreeRecursive);
    });

    it('should return the root hash of the tree', () => {
      const tree = createMerkleTree(datas);
      const root = tree.root();

      expect(root).toEqual(
        '57abe311e24af7f1c858d110583125109504a77c015d4bb04365f942a53194a8',
      );
    });

    it('should return the correct height of a tree with only a root', () => {
      const tree = createMerkleTree(['root tree']);

      expect(tree.height()).toEqual(1);
    });

    it('should return the correct height of a tree with odd data', () => {
      const tree = createMerkleTree(datas);

      expect(tree.height()).toEqual(4);
    });

    it('should return the correct height of a tree with even data', () => {
      const tree = createMerkleTree(['first', 'second', 'third']);

      expect(tree.height()).toEqual(3);
    });

    it('should return the root when get level one', () => {
      const tree = createMerkleTree(['root tree']);

      expect(tree.level(1)).toEqual([
        crypto.createHash('sha256').update('root tree').digest('hex'),
      ]);
    });

    it('should return the leaves when get level two on a simple tree', () => {
      const tree = createMerkleTree(['first', 'second']);

      expect(tree.level(2)).toEqual([
        crypto.createHash('sha256').update('first').digest('hex'),
        crypto.createHash('sha256').update('second').digest('hex'),
      ]);
    });

    it('should return the given level of a tree', () => {
      const tree = createMerkleTree(datas);

      expect(tree.level(3)).toEqual([
        'f15184513bbcea7ba4c8135abe29e3a132194c2aecf9d05ad5ea88122a1a2ab1',
        '41e788a45d72d8ba1831ea686fe137beff4e90e7ee37935dc9ae8c187482b603',
        '5690b4ac26c611a44fe6daf500e26e22afbaecaa5a14fe5aa55a73a6f35355a5',
      ]);
    });

    it('should detect that data is part of the tree or not', () => {
      const tree = createMerkleTree(datas);

      expect(tree.checkIntegrity('just')).toBeTruthy();
      expect(tree.checkIntegrity('42')).toBeFalsy();
    });
  });
});

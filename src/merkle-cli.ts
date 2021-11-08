import * as commander from 'commander';
import { exit } from 'process';

import { createMerkleTree } from './merkle.module';

const program = new commander.Command();

function parseLevel(value, dummyPrevious) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

program
  .option('-r, --root', 'show Merkle tree root', false)
  .option('-h, --height', 'show height of the Merkle tree', false)
  .option('-p, --print', 'print the Merkle tree')
  .option('-i, --integrity <data>', 'check if a data is part of the tree', '')
  .option('-l, --level <number>', 'show Merkle tree level', parseLevel)
  .option(
    '-d, --data <items>',
    'data to build the Merkle tree from',
    commaSeparatedList,
  );

program.parse();

const options = program.opts();

if (!options.data) {
  program.usage();
  exit(1);
}

const merkleTree = createMerkleTree(options.data, 'recursive');

if (options.print) {
  console.log(`Merkle tree:`);
  merkleTree.print();
}

if (options.root) {
  console.log(`Merkle tree root is: ${merkleTree.root()}`);
}

if (options.height) {
  console.log(`Merkle tree height is: ${merkleTree.height()}`);
}

if (options.level > 0) {
  console.log(`Merkle tree level ${options.level}:`);
  console.log(merkleTree.level(options.level));
}

if (options.integrity) {
  console.log(
    `Merkle tree integrity, data: ${options.integrity} is${
      merkleTree.checkIntegrity(options.integrity) ? '' : ' NOT'
    } part of the tree`,
  );
}

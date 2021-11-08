# Merkle tree

## How to use

Have node 14+ and Yarn installed

### install
```shell
yarn
```

### run tests

```shell
yarn test
```

### run cli

to diplay usage, just run:
```shell
yarn merkle --help
```

for example, creating a merkle tree and check its height:
```shell
yarn merkle -d qwe,asd,zxc --height
```

## Additional questions

### Using the illustration above, let’s assume I know the whole Merkle tree. Someone gives me the L2 data block but I don’t trust them. How can I check if L2 data is valid?

It depends if we know that L2 is related to the H(0-1) leaf or if we just have some original data chunck without knowing its related leaf.
* If we know that L2 is related to the H(0-1), it would suffice to hash L2 and compare it to H(0-1).
* If we don't know that L2 is related to H(0-1) (which is most likely the case), we could hash L2 and compare it to all leaves hashes. If we find a matching hash, then L2 is probably comming from this tree (although it could be a hash collision I guess). I implemented such a feature as an example.

### I know only the L3 data block and the Merkle root. What is the minimum information needed to check that the L3 data block and the Merkle root belong to the same Merkle tree?

To rebuild the root hash from L3 and compare it to the given root hash, I'll need to know the hash of each brother's node of the considerated branch. In L3 case, it would be H(1-1) and H(0).

### What are some Merkle tree use cases?

As Merkle tree allow fast data integrity checks, some use cases would be peer-to-peer data validation (as most p2p protocols are based on data chunk exchange). Another use case could be validation of large streamed data-set, like for example in a GIS system that would stream large amount of geo tiles. In some extend it could even be used to ensure data storage (or event databases) replicats are in sync without any data corruption.
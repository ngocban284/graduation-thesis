import { poseidon } from "circomlibjs";
import { MerkleTree } from "fixed-merkle-tree";

let tree = new MerkleTree(10, [], {
  hashFunction: (left, right) => String(poseidon([left, right])),
  zeroElement:
    "3042774122929058629117742057409317273972932196304097622662323601237587181833",
});

export default tree;

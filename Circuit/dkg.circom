pragma circom 2.1.7;
include "./src/lib/commitmentHasher.circom";
include "./src/lib/MerkleTree.circom";
template Withdraw(levels,k) {
    // public signal
    signal input root;
    signal input nullifierHash;
    signal input lead;
    signal input amount;
    signal input pkDAO[2];
    signal input recipient; // not taking part in any computations
    signal input relayer;  // not taking part in any computations
    signal input fee;      // not taking part in any computations
    // signal input refund;   // not taking part in any computations

    // private signal
    signal input nullifier;
    signal input v[k];
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal input index;

    component hasher = CommitmentHasher(k);
    hasher.nullifier <== nullifier;
    for(var i =0;i<k;i++){
        hasher.v[i] <== v[i];
    }
    hasher.amount <== amount;
    hasher.index <== index;
    hasher.pkDAO[0] <== pkDAO[0];
    hasher.pkDAO[1] <== pkDAO[1];

    nullifierHash === hasher.nullifierHash;
    lead === hasher.lead;

    component tree = MerkleTreeChecker(levels);
    tree.leaf <== hasher.commitment;
    tree.pathRoot <== root;
    for (var i = 0; i < levels; i++) {
        tree.pathElements[i] <== pathElements[i];
        tree.pathIndices[i] <== pathIndices[i];
    }

    // Add hidden signals to make sure that tampering with recipient or fee will invalidate the snark proof
    // Most likely it is not required, but it's better to stay on the safe side and it only takes 2 constraints
    // Squares are used to prevent optimizer from removing those constraints
    signal recipientSquare;
    signal feeSquare;
    signal relayerSquare;
    // signal refundSquare;
    recipientSquare <== recipient * recipient;
    feeSquare <== fee * fee;
    relayerSquare <== relayer * relayer;
    // refundSquare <== refund * refund;
}
component main {public [root, nullifierHash, lead, amount, pkDAO,recipient,relayer,fee]} = Withdraw(10,4);
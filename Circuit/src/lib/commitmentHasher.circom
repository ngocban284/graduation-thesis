pragma circom 2.1.7;
include "./poseidon.circom";
include "../../node_modules/circomlib/circuits/escalarmulany.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";
template checkAmountAtIndex(k){
    signal input v[k];
    signal input amount;
    signal input index;

    var checkAmount = 0;
    component isIndex[k];
    for(var i = 0; i< k;i++){
        isIndex[i] = IsEqual();
        isIndex[i].in[0] <== i;
        isIndex[i].in[1] <== index;
        checkAmount += isIndex[i].out * v[i];
    }
    component isAmount = IsEqual();
    isAmount.in[0] <== amount;
    isAmount.in[1] <-- checkAmount;
    isAmount.out === 1;
}
template CommitmentHasher(k){
    signal input nullifier;
    signal input v[k];
    signal input amount;
    signal input index;
    signal input pkDAO[2];

    signal output commitment;
    signal output nullifierHash;
    signal output lead;

    var BASE[2] = [
        5299619240641551281634865583518297030282874472190772894086521144482721001553,
        16950150798460657717958625567821834550301663161624707787222815936182638968203
    ];

    component checkAmount = checkAmountAtIndex(k);
    component poseidonHasher = Poseidon(1+k);
    component nullifierHasher = Poseidon(3);
    component leadHasher = Poseidon(2);
    component commitmentHasher = Poseidon(4);

    component nullifierBits = Num2Bits(256);
    component mulEscalarSharekey = EscalarMulAny(256);
    component mulEscalarPublickey = EscalarMulAny(256);

    // check v[index] == amount
    for(var i = 0;i<k;i++){
        checkAmount.v[i] <== v[i];
    }
    checkAmount.amount <== amount;
    checkAmount.index <== index;

    // compute sharekey
    nullifierBits.in <== nullifier;
    mulEscalarSharekey.p[0] <== pkDAO[0];
    mulEscalarSharekey.p[1] <== pkDAO[1];
    for (var i = 0; i < 256; i++) {
        mulEscalarSharekey.e[i] <== nullifierBits.out[i];
    }

    // compute publickey
    mulEscalarPublickey.p[0] <== BASE[0];
    mulEscalarPublickey.p[1] <== BASE[1];
    for (var i = 0; i < 256; i++) {
        mulEscalarPublickey.e[i] <== nullifierBits.out[i];
    }

    // poseidon hash
    poseidonHasher.inputs[0] <== nullifier;
    for(var i =0; i<k;i++){
        poseidonHasher.inputs[1+i] <== v[i];
    }

    // nullifier hash
    nullifierHasher.inputs[0] <== nullifier;
    nullifierHasher.inputs[1] <== amount;
    nullifierHasher.inputs[2] <== index;

    // lead hash
    leadHasher.inputs[0] <== mulEscalarSharekey.out[0];
    leadHasher.inputs[1] <== index;

    // commitment 
    var sumV = 0;
    for (var i =0; i<k;i++){
        sumV += v[i];
    }
    commitmentHasher.inputs[0] <== poseidonHasher.out;
    commitmentHasher.inputs[1] <== mulEscalarPublickey.out[0];
    commitmentHasher.inputs[2] <== mulEscalarPublickey.out[1];
    commitmentHasher.inputs[3] <-- sumV;

    commitment <== commitmentHasher.out;
    nullifierHash <== nullifierHasher.out;
    lead <== leadHasher.out;
}
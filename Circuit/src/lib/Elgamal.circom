pragma circom 2.1.7;
include "../../node_modules/circomlib/circuits/escalarmulany.circom";
include "../../node_modules/circomlib/circuits/gates.circom";
template ElgamalEncrypt() {
    // public signal
    signal input pkB[2];
    signal input encrypted;

    // private signal
    signal input skA;
    signal input message;

    component skABits = Num2Bits(256);
    component mulPointEscalar = EscalarMulAny(256);
    skABits.in <== skA;
    mulPointEscalar.p[0] <== pkB[0];
    mulPointEscalar.p[1] <== pkB[1];
    for (var i = 0; i < 256; i++) {
        mulPointEscalar.e[i] <== skABits.out[i];
    }

    component padBits = Num2Bits(256);
    component messageBits = Num2Bits(256);
    component encryptedBits = Bits2Num(256);
    component xors[256];
    padBits.in <== mulPointEscalar.out[0];
    messageBits.in <== message;

    for (var i = 0; i < 256; i++) {
        xors[i] = XOR();
        xors[i].a <== padBits.out[i];
        xors[i].b <== messageBits.out[i];
        encryptedBits.in[i] <== xors[i].out;
    }
    encrypted === encryptedBits.out;
 }

template ElgamalDecrypt(){
    // public signal
    signal input pkB[2];
    signal input encrypted;

    // private signal
    signal input skA;
    signal input message;

    component skABits = Num2Bits(256);
    component mulPointEscalar = EscalarMulAny(256);
    skABits.in <== skA;
    mulPointEscalar.p[0] <== pkB[0];
    mulPointEscalar.p[1] <== pkB[1];
    for (var i = 0; i < 256; i++) {
        mulPointEscalar.e[i] <== skABits.out[i];
    }

    component padBits = Num2Bits(256);
    component encryptedBits = Num2Bits(256);
    component messageBits = Bits2Num(256);
    component xors[256];
    padBits.in <== mulPointEscalar.out[0];
    encryptedBits.in <== encrypted;

    for (var i = 0; i < 256; i++) {
        xors[i] = XOR();
        xors[i].a <== padBits.out[i];
        xors[i].b <== encryptedBits.out[i];
        messageBits.in[i] <== xors[i].out;
    }
    message === messageBits.out;
}

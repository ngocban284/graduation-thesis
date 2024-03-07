pragma circom 2.1.7;
include "./src/lib/Elgamal.circom";

template AddZp(n) {
    signal input in[n];
    signal output out;

    var Zp = 2736030358979909402780800718157159386076813972158567259200215660948447373041;
    var sum = 0;
    
    for (var i = 0; i < n; i++) {
        sum = (sum + in[i]) % Zp;
    }
    out <-- sum;
}
template verifyF(T_COMMITTEE){
    // public signal
    signal input Commitment[T_COMMITTEE][2];
    signal input index;
    // private signal
    signal input f;

    var BASE[2] = [
        5299619240641551281634865583518297030282874472190772894086521144482721001553,
        16950150798460657717958625567821834550301663161624707787222815936182638968203
    ];
    component fBits = Num2Bits(256);
    component mulEscalarLeft = EscalarMulAny(256);
    fBits.in <== f;
    mulEscalarLeft.p[0] <== BASE[0];
    mulEscalarLeft.p[1] <== BASE[1];
    for (var i = 0; i < 256; i++) {
        mulEscalarLeft.e[i] <== fBits.out[i];
    }

    // check commitment
    var x = 1;
    component iBits[T_COMMITTEE];
    component escalarMulRights[T_COMMITTEE];
    iBits[0] = Num2Bits(256);
    escalarMulRights[0] = EscalarMulAny(256);
    iBits[0].in <-- x;
    escalarMulRights[0].p[0] <== Commitment[0][0];
    escalarMulRights[0].p[1] <== Commitment[0][1];
    for (var i = 0; i < 256; i++){
        escalarMulRights[0].e[i] <== iBits[0].out[i];
    }
    for (var i = 1 ; i < T_COMMITTEE; i++) {
        // this is not safe for big index
        x = x * index ;
        iBits[i] = Num2Bits(256);
        escalarMulRights[i] = EscalarMulAny(256);
        iBits[i].in <-- x;
        escalarMulRights[i].p[0] <== Commitment[i][0];
        escalarMulRights[i].p[1] <== Commitment[i][1];
        for( var j = 0; j < 256; j++){
            escalarMulRights[i].e[j] <== iBits[i].out[j];
        }
    }

    component adder[T_COMMITTEE];
    adder[0] = BabyAdd();
    adder[0].x1 <== 0;
    adder[0].y1 <== 1;
    adder[0].x2 <== escalarMulRights[0].out[0];
    adder[0].y2 <== escalarMulRights[0].out[1];
    
    for(var i = 1; i < T_COMMITTEE; i++){
        adder[i] = BabyAdd();
        adder[i].x1 <== adder[i-1].xout;
        adder[i].y1 <== adder[i-1].yout;
        adder[i].x2 <== escalarMulRights[i].out[0];
        adder[i].y2 <== escalarMulRights[i].out[1];
    }

    adder[T_COMMITTEE-1].xout === mulEscalarLeft.out[0];
    adder[T_COMMITTEE-1].yout === mulEscalarLeft.out[1];
}

template RevealLinking(T_COMMITTEE,N_COMMITTEE){
        // public signal
    signal input Commitment[T_COMMITTEE][2];
    signal input pkB[N_COMMITTEE-1][2];
    signal input encrypted[N_COMMITTEE-1];
    signal input pkAddressIn[2];
    signal input D[2];
    signal input indexA;

    // private signal
    signal input decrypted[N_COMMITTEE-1];
    signal input skA;
    signal input fA;

    // validate fA
    component fVerifier = verifyF(T_COMMITTEE);
    for(var i = 0; i < T_COMMITTEE; i++){
        fVerifier.Commitment[i][0] <== Commitment[i][0];
        fVerifier.Commitment[i][1] <== Commitment[i][1];
    }
    fVerifier.index <== indexA;
    fVerifier.f <== fA;

    component decryption[N_COMMITTEE-1];
    component sumF = AddZp(N_COMMITTEE);

    for (var i = 0; i < N_COMMITTEE-1; i++) {
        decryption[i] = ElgamalDecrypt();

        decryption[i].pkB[0] <== pkB[i][0];
        decryption[i].pkB[1] <== pkB[i][1];
        decryption[i].encrypted <== encrypted[i];

        decryption[i].skA <== skA;
        decryption[i].message <== decrypted[i];

        sumF.in[i] <== decrypted[i];
    }
    sumF.in[N_COMMITTEE-1] <== fA;

    component skBits = Num2Bits(256);
    component mulEscalarSk = EscalarMulAny(256);
    skBits.in <== sumF.out;

    mulEscalarSk.p[0] <== pkAddressIn[0];
    mulEscalarSk.p[1] <== pkAddressIn[1];
    for (var i = 0; i < 256; i++) {
        mulEscalarSk.e[i] <== skBits.out[i];
    }
    
    D[0] === mulEscalarSk.out[0];
    D[1] === mulEscalarSk.out[1];
}
// this circuit have to use ptau 20. ~25300 non-linear contrant
component main {public [Commitment,pkB, encrypted, pkAddressIn, D, indexA]} = RevealLinking(3,5);
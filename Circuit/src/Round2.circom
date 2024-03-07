pragma circom 2.1.7;
include "./lib/Elgamal.circom";
template Round2ForOne(T_COMMITTEE){
    // public signal
    signal input Commitment[T_COMMITTEE][2];
    signal input pkB[2];
    signal input indexB;
    signal input encrypted;

    // private signal
    signal input skA;
    signal input f;

    var BASE[2] = [
        5299619240641551281634865583518297030282874472190772894086521144482721001553,
        16950150798460657717958625567821834550301663161624707787222815936182638968203
    ];

    // check encrypt     
    component elgamal = ElgamalEncrypt(); 
    elgamal.pkB[0] <== pkB[0];
    elgamal.pkB[1] <== pkB[1];
    elgamal.encrypted <== encrypted;
    elgamal.skA <== skA;
    elgamal.message <== f;

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
        x = x * indexB;
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
template Round2(T_COMMITTEE, N_COMMITTEE) {
    // public signal 
    signal input Commitment[T_COMMITTEE][2];
    signal input pkB[N_COMMITTEE - 1][2];
    signal input indexB[N_COMMITTEE -1];
    signal input encrypted[N_COMMITTEE -1 ];

    // private signal
    signal input skA;
    signal input f[N_COMMITTEE -1];

    component round2[N_COMMITTEE -1];
    
    for(var i = 0; i < N_COMMITTEE -1; i++){
        round2[i] = Round2ForOne(T_COMMITTEE);
        for(var j = 0; j < T_COMMITTEE; j++){
            round2[i].Commitment[j][0] <== Commitment[j][0];
            round2[i].Commitment[j][1] <== Commitment[j][1];
        }
        round2[i].pkB[0] <== pkB[i][0];
        round2[i].pkB[1] <== pkB[i][1];
        round2[i].indexB <== indexB[i];
        round2[i].encrypted <== encrypted[i];
        round2[i].skA <== skA;
        round2[i].f <== f[i];
    }
}
// this circuit have to use ptau 22. ~50600 non-linear contrant
component main {public [Commitment, pkB, indexB, encrypted]} = Round2(3,5);
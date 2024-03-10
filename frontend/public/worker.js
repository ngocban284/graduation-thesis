importScripts("./snarkjs.min.js");

self.addEventListener("message", async ({ data }) => {
  const fn = data[0];
  switch (fn) {
    case "fullProveWithdraw":
      let inputWithdraw = data[1];
      console.log("Worker: fullProveWithdraw");
      try {
        const result = await snarkjs.groth16.fullProve(
          inputWithdraw,
          "./zk-resource/withdraw/Withdraw.wasm",
          "./zk-resource/withdraw/Withdraw.zkey"
        );

        postMessage(result);
        break;
      } catch (e) {
        postMessage("Error: Couldn't prove the circuit");
        break;
      }
    case "fullProveRecovery":
      console.log("Worker: fullProveRecovery");
      let feat_vec_prime = data[1][0];
      let err_vector = data[1][1];
      let hash_feat_vec = data[1][2];
      let nullifier = data[1][3];
      let nullifierHash = data[1][4];
      let personalInfoHash = data[1][5];
      let hashOfPersonalInfoHash = data[1][6];

      try {
        const inputs = {
          err_code: [...err_vector],
          feat_vec_prime: [...feat_vec_prime],
          hash_feat_vec: hash_feat_vec,
          nullifier: nullifier,
          nullifierHash: nullifierHash,
          personalInfoHash: personalInfoHash,
          hashOfPersonalInfoHash: hashOfPersonalInfoHash,
        };
        const result = await snarkjs.groth16.fullProve(
          inputs,
          "./zk-resource/reedSolomon/ReedSolomon.wasm",
          "./zk-resource/reedSolomon/ReedSolomon.zkey"
        );
        postMessage(result);
        break;
      } catch (e) {
        postMessage("Error: Couldn't prove the circuit");
        break;
      }
    // case "exportSolidityCallData":
    //   const [__, proof, publicSignals] = data;
    //   const rawCallData = await snarkjs.groth16.exportSolidityCallData(
    //     proof.data,
    //     publicSignals.data
    //   );
    //   postMessage(rawCallData);
    //   break;
    // case 'verify':
    //   const [___, vkey, proof, publicSignals] = data
    //   const proofVerified = await snarkjs.groth16.verify(
    //     vkey,
    //     publicSignals.data,
    //     proof.data
    //   )
    //   postMessage(proofVerified)
    //   break
    default:
      break;
  }
});

importScripts("./snarkjs.min.js");
// const snarkjs = require("snarkjs");

self.addEventListener("message", async ({ data }) => {
  const fn = data[0];
  switch (fn) {
    case "fullProve":
      const [_, input] = data;
      try {
        const result = await snarkjs.groth16.fullProve(
          input,
          "./zk-resource/withdraw/Withdraw.wasm",
          "./zk-resource/withdraw/Withdraw.zkey"
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

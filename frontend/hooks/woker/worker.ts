// Use the 'any' type for self to avoid TypeScript errors
const selfWorker: any = self;

// Import snarkjs in the worker
selfWorker.importScripts("/snarkjs.min.js");

selfWorker.addEventListener(
  "message",
  async (event: MessageEvent<{ inputs: any; zkey: any; wasm: string }>) => {
    console.log("Proof generation", event.data);
    try {
      //@ts-expect-error
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        event.data.inputs,
        `/${event.data.wasm}`,
        { type: "mem", data: new Uint8Array(event.data.zkey) }
      );
      console.log("Proof generated", proof);
      selfWorker.postMessage({
        proof: proof,
        publicSignals: publicSignals,
        error: undefined,
      });
    } catch (error) {
      selfWorker.postMessage({
        proof: undefined,
        publicSignals: undefined,
        error: "Proof generation failed",
      });
    }
  }
);

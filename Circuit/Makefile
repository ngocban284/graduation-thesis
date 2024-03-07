SHELL = bash

circom = dkg.circom
r1cs = dkg.r1cs
wasm = dkg_js/dkg.wasm
wit_gen = dkg_js/generate_witness.js
compile_outputs = dkg_js/witness_calculator.js $(r1cs) $(wasm) $(wit_gen)
pk = dkg.zkey
vk = dkg.json
ptau = dkg.ptau
keys = $(pk) $(vk)
p_input = dkg.input.json
wit = dkg.wtns
pf = proof.json
inst = public.json
prove_outputs = $(pf) $(inst)

all: copy_zkey verify

copy_zkey:
	cp out/withdraw.zkey dkg.zkey

$(compile_outputs): $(circom)
	circom $< --r1cs --wasm

$(vk): $(pk)
	snarkjs zkey export verificationkey $(pk) $(vk)

$(wit): $(p_input) $(wasm) $(wit_gen)
	node $(wit_gen) $(wasm) $(p_input) $@

$(prove_outputs): $(wit) $(pk)
	snarkjs groth16 prove $(pk) $(wit) $(pf) $(inst)

.PHONY = verify clean calldata

verify: $(pf) $(inst) $(vk)
	snarkjs groth16 verify $(vk) $(inst) $(pf)

clean:
	rm -f $(compile_outputs) $(ptau) $(keys) $(wit) $(prove_outputs) verifier.sol rm tmp.ptau rm tmp1.ptau rm tmp.zkey
	rmdir dkg_js

verifier.sol: $(pk)
	snarkjs zkey export solidityverifier $(pk) $@

calldata: $(wit) $(prove_outputs)
	snarkjs generatecall
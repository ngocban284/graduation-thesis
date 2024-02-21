import ReedSolomonEC from "./ErrorCorrection";
import feat_vector_raw from "./feat_vector_raw.json";

async function test() {
  const rec = new ReedSolomonEC();
  rec.fuzzyCommitment(feat_vector_raw);
}

test();

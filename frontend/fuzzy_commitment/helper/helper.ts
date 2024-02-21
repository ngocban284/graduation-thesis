import feat_vector_raw from "../feat_vector_raw.json";
import { writeFileSync } from "fs";

export const BinaryQuantization = async (feat_vector: number[]) => {
  // get all value of feat_vector object
  //   feat_vector = Object.values(feat_vector);

  // binary quantization
  for (let index = 0; index < feat_vector.length; index++) {
    if (feat_vector[index] < 0) {
      feat_vector[index] = 0;
    } else {
      feat_vector[index] = 1;
    }
  }

  return feat_vector;
};

BinaryQuantization(feat_vector_raw).then((result) => {
  console.log(result.length);
});

import ReedSolomonEncoder from "./reedsolomon/ReedSolomonEncoder";
import ReedSolomonDecoder from "./reedsolomon/ReedSolomonDecoder";
import GenericGF from "./reedsolomon/GenericGF";

class ReedSolomonEC {
  static MESSAGE_LENGTH = 32;
  static ERROR_CORRECTION_LENGTH = 16;
  static SECRET_LENGTH = 64;

  private encoder: ReedSolomonEncoder;
  private decoder: ReedSolomonDecoder;

  constructor() {}

  initializeRS = () => {
    const field = GenericGF.AZTEC_DATA_8;
    this.encoder = new ReedSolomonEncoder(field);
    this.decoder = new ReedSolomonDecoder(field);
  };
}

export default ReedSolomonEC;

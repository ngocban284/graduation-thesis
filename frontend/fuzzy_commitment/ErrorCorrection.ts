import ReedSolomonEncoder from "./reedsolomon/ReedSolomonEncoder";
import ReedSolomonDecoder from "./reedsolomon/ReedSolomonDecoder";
import GenericGF from "./reedsolomon/GenericGF";
import descriptorTest from "./descriptor.json";
import { BinaryQuantization } from "./helper/helper";

class ReedSolomonEC {
  static MESSAGE_LENGTH = 32;
  static ERROR_CORRECTION_LENGTH = 16;
  static SECRET_LENGTH = 64;

  ec: {
    dataLength: number;
    messageLength: number;
    errorCorrectionLength: number;
    encode: (message: Int32Array) => void;
    decode: (message: Int32Array) => void;
  };

  constructor() {
    this.ec = this.initializeRS(
      ReedSolomonEC.MESSAGE_LENGTH,
      ReedSolomonEC.ERROR_CORRECTION_LENGTH
    );
  }

  initializeRS(messageLength: number, errorCorrectionLength: number) {
    var dataLength = messageLength - errorCorrectionLength;
    var encoder = new ReedSolomonEncoder(GenericGF.AZTEC_DATA_8);
    var decoder = new ReedSolomonDecoder(GenericGF.AZTEC_DATA_8);
    return {
      dataLength: dataLength,
      messageLength: messageLength,
      errorCorrectionLength: errorCorrectionLength,

      encode: function (message: Int32Array) {
        encoder.encode(message, errorCorrectionLength);
      },

      decode: function (message: Int32Array) {
        decoder.decode(message, errorCorrectionLength);
      },
    };
  }

  async fuzzyCommitment(feat_vector: number[]) {
    const quantizatedFeatVector = await BinaryQuantization(feat_vector);
  }
}

export default ReedSolomonEC;

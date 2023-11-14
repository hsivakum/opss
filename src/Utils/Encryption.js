import { RsaService } from "./EncryptUtil";

export class EncryptUtil {
  static encrypt = valueToEncrypt => {
    const jsEncrypt = new RsaService();
    return jsEncrypt?.encrypt(valueToEncrypt);
  };
}

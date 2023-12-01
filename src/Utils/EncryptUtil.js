import { Buffer } from "buffer";
import crypto from "crypto-browserify";

export class RsaService {
  constructor() {
    this.scmKey = this.decode(process.env.REACT_APP_PUBLIC_KEY);
  }

  decode = str => Buffer.from(str, "base64").toString("binary");

  encrypt(plaintext) {
    const buffer = Buffer.from(plaintext);

    console.log('this is key ', this.scmKey, crypto, buffer)
    const encrypted =  crypto.publicEncrypt(this.scmKey, buffer);

    return encrypted.toString("base64");
  }
}

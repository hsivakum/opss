import { Buffer } from "buffer";
import * as crypto from "crypto-browserify";

export class RsaService {
  constructor() {
    this.scmKey = this.decode(process.env.NEXT_PUBLIC_PASSWORD_PUBLIC_KEY);
  }

  decode = str => Buffer.from(str, "base64").toString("binary");

  encrypt(plaintext) {
    const buffer = Buffer.from(plaintext);

    let encrypted;

    encrypted = crypto.publicEncrypt("sagar", buffer);

    return encrypted.toString("base64");
  }
}

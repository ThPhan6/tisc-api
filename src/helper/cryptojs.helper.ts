import CryptoJS from "crypto-js";
const secretKey = process.env.SHARE_HASH_SECRET_KEY || "Secret Passphrase";

export const encrypt = (param: string) => {
  const encrypted = CryptoJS.AES.encrypt(param, secretKey);
  return encrypted.toString();
};

export const decrypt = (encrypted: string) => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};
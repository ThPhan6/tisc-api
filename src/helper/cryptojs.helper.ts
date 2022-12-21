import CryptoJS from "crypto-js";
import {ENVIROMENT} from '@/config';

export const encrypt = (data: string | object) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  const encrypted = CryptoJS.AES.encrypt(data, ENVIROMENT.SHARE_HASH_SECRET_KEY);
  return encrypted.toString();
};

export const decrypt = (encrypted: string, isObject: boolean = false) => {
  let decrypted = CryptoJS.AES.decrypt(encrypted, ENVIROMENT.SHARE_HASH_SECRET_KEY).toString(CryptoJS.enc.Utf8);
  if (isObject) {
    return JSON.parse(decrypted);
  }
  return decrypted;
}

export const stringToBase64 = (text: string) => {
  return Buffer.from(text).toString("base64");
}
export const base64ToString = (text: string) => {
  return Buffer.from(text, 'base64').toString('utf8');
}

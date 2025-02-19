import * as CryptoJS from 'crypto-js';
import { AppConstants } from '../app-constants/app-constants';

export class EncryptorDecryptor {
  static encryptUsingAES256(encString: string): string {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(encString), AppConstants.key, {
      keySize: 128 / 8,
      iv: AppConstants.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  static decryptUsingAES256(decString: string): string {
    const decrypted = CryptoJS.AES.decrypt(decString, AppConstants.key, {
      keySize: 128 / 8,
      iv: AppConstants.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

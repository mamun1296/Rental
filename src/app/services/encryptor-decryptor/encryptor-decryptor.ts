
import * as CryptoJS from 'crypto-js';
import { AppConstants } from '../../class/app-constants/app-constants';

export class EncryptorDecryptor{
    static encryptUsingAES256(encString:any) {
         var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(encString), AppConstants.key, {
             keySize: 128 / 8,
             iv: AppConstants.iv,
             mode: CryptoJS.mode.CBC,
             padding: CryptoJS.pad.Pkcs7
         });
         return encrypted.toString();
         //return encrypted.toString(CryptoJS.enc.Base64);
     }
 
     static decryptUsingAES256(decString:any) {
         var decrypted = CryptoJS.AES.decrypt(decString, AppConstants.key, {
             keySize: 128 / 8,
             iv: AppConstants.iv,
             mode: CryptoJS.mode.CBC,
             padding: CryptoJS.pad.Pkcs7
         });
         // console.log('Decrypted : ' + decrypted);
         // console.log('utf8 = ' + decrypted.toString(CryptoJS.enc.Utf8));
         return decrypted.toString(CryptoJS.enc.Utf8);
     }
 }
import * as CryptoJS from 'crypto-js';
export class AppConstants {
    public static app_environment = "Local";  // Local // Public
    public static authority = "http://localhost:5000"

    public static clientId = "AngularClient";
    public static clientRoot = "http://localhost:4200";


    public static key = CryptoJS.enc.Utf8.parse('7391824694761634');
    public static iv = CryptoJS.enc.Utf8.parse('7391824694761634');
   

    public static True = "true";
    public static False = "false";

}
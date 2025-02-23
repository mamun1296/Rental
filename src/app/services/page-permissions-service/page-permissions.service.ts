// import { Injectable } from '@angular/core';
// import { EncryptorDecryptor } from '../../class/encryptor-decryptor/encryptor-decryptor';


// export enum ActionPermission {
//   Add = 3,
//   Edit = 4,
//   Delete = 5,
//   AllPermissions = 6 
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PagePermissionsService {

//   private mainMenuId: number | null = null;
//   private subMenuId: number | null = null;
//   private subProcessId: number | null = null;

//   setMainMenuId(mainMenuId: number): void {
//     this.mainMenuId = mainMenuId;
//   }

//   setSubMenuId(subMenuId: number): void {
//     this.subMenuId = subMenuId ?? null;
//   }

//   setSubProcessId(subProcessId: number): void {
//     this.subProcessId = subProcessId ?? null;
//   }

//   getMainMenuId(): number | null {
//     return this.mainMenuId;
//   }

//   getSubMenuId(): number | null {
//     return this.subMenuId;
//   }

//   getSubProcessId(): number | null {
//     return this.subProcessId;
//   }

//   clearIds(){
//     this.mainMenuId = null;
//     this.subMenuId =  null;
//     this.subProcessId = null;
//   }


//   private readonly PAGE_PERMISSIONS = 'PAGE_PERMISSIONS';
//   private pagePermissionsCache: any[] | null = null;

//   private isLocalStorageAvailable(): boolean {
//     return typeof localStorage !== 'undefined';
//   }

//   // public getPagePermissions(): any {
//   //   if (this.pagePermissionsCache) {
//   //     return this.pagePermissionsCache;
//   //   }

//   //   if (this.isLocalStorageAvailable()) {
//   //     const encryptedPagePermissions = localStorage.getItem(this.PAGE_PERMISSIONS);
//   //     console.log("encryptedPagePermissions",encryptedPagePermissions);
//   //     if (encryptedPagePermissions) {
//   //       const decryptedPagePermissions = EncryptorDecryptor.decryptUsingAES256(encryptedPagePermissions);
//   //      if(decryptedPagePermissions != null){
//   //       const pagePermissions = JSON.parse(decryptedPagePermissions);

//   //       this.pagePermissionsCache = pagePermissions.map((permission: any) => ({
//   //         mainMenuId: permission.mainMenuId,
//   //         subMenuId: permission.subMenuId,
//   //         processId: permission.processId,
//   //         subProcessId: permission.subProcessId,
//   //         actionId: permission.actionId
//   //       }));

//   //       return this.pagePermissionsCache;
//   //      }
//   //     }
//   //   }

//   //   return null;
//   // }


//   public getPagePermissions(): any {
//     if (this.pagePermissionsCache) {
//         return this.pagePermissionsCache;
//     }

//     if (this.isLocalStorageAvailable()) {
//         const encryptedPagePermissions = localStorage.getItem(this.PAGE_PERMISSIONS);
//         // console.log("encryptedPagePermissions:", encryptedPagePermissions);
        
//         if (encryptedPagePermissions) {
//             const decryptedPagePermissions = EncryptorDecryptor.decryptUsingAES256(encryptedPagePermissions);
//             // console.log("decryptedPagePermissions:", decryptedPagePermissions);
            
//             // Ensure decryptedPagePermissions is a valid JSON string before parsing
//             if (decryptedPagePermissions && decryptedPagePermissions.trim()) {
//                 try {
//                     const pagePermissions = JSON.parse(decryptedPagePermissions);

//                     this.pagePermissionsCache = pagePermissions.map((permission: any) => ({
//                         mainMenuId: permission.mainMenuId,
//                         subMenuId: permission.subMenuId,
//                         processId: permission.processId,
//                         subProcessId: permission.subProcessId,
//                         actionId: permission.actionId
//                     }));

//                     return this.pagePermissionsCache;
//                 } catch (error) {
//                     console.error("Error parsing decryptedPagePermissions:", error);
//                 }
//             } else {
//                 console.warn("Decrypted page permissions is empty or invalid.");
//             }
//         }
//     }

//     return null;
// }


//   public clearPagePermissions(): void {
//     if (this.isLocalStorageAvailable()) {
//       localStorage.removeItem(this.PAGE_PERMISSIONS);
//     }
//     this.pagePermissionsCache = null;
//   }



//   public getPermissionsByPage(mainMenuId: number, subMenuId?: number, subProcessId?: number): any[] | null {
//     const permissions = this.getPagePermissions();
//     // console.log("page permissions",permissions);

//     if (!permissions) return null;
  
//     return permissions.filter(permission => 
//       permission.mainMenuId === mainMenuId &&
//       (subMenuId === undefined || permission.subMenuId === subMenuId) &&
//       (subProcessId === undefined || permission.subProcessId === subProcessId)
//     );
//   }
  

//   public hasPermission(actionIds: ActionPermission[]): boolean {

//     const permissions = this.getPermissionsByPage(this.mainMenuId, this.subMenuId, this.subProcessId);
   
//     // console.log("page permissions",permissions);

//     if (!permissions) return false;
//     return permissions.some(permission => actionIds.includes(permission.actionId));
//   }

//   public hasAddPermission(): boolean {
//     const ADD_ACTION_IDS = [ActionPermission.Add, ActionPermission.AllPermissions];
//     return this.hasPermission(ADD_ACTION_IDS);
//   }

//   public hasEditPermission(): boolean {
//     const EDIT_ACTION_IDS = [ActionPermission.Edit, ActionPermission.AllPermissions];
//     return this.hasPermission(EDIT_ACTION_IDS);
//   }

//   public hasDeletePermission(): boolean {
//     const DELETE_ACTION_IDS = [ActionPermission.Delete, ActionPermission.AllPermissions];
//     return this.hasPermission(DELETE_ACTION_IDS);
//   }
// }







// import { Injectable } from '@angular/core';
// import { EncryptorDecryptor } from '../../class/encryptor-decryptor/encryptor-decryptor';


// export enum ActionPermission {
//   Add = 3,
//   Edit = 4,
//   Delete = 5,
//   AllPermissions = 6 
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PagePermissionsService {

//   private mainMenuId: number | null = null;
//   private subMenuId: number | null = null;
//   private subProcessId: number | null = null;

//   setMainMenuId(mainMenuId: number): void {
//     this.mainMenuId = mainMenuId;
//   }

//   setSubMenuId(subMenuId: number): void {
//     this.subMenuId = subMenuId ?? null;
//   }

//   setSubProcessId(subProcessId: number): void {
//     this.subProcessId = subProcessId ?? null;
//   }

//   getMainMenuId(): number | null {
//     return this.mainMenuId;
//   }

//   getSubMenuId(): number | null {
//     return this.subMenuId;
//   }

//   getSubProcessId(): number | null {
//     return this.subProcessId;
//   }

//   clearIds(){
//     this.mainMenuId = null;
//     this.subMenuId =  null;
//     this.subProcessId = null;
//   }


//   private readonly PAGE_PERMISSIONS = 'PAGE_PERMISSIONS';
//   private pagePermissionsCache: any[] | null = null;

//   private isLocalStorageAvailable(): boolean {
//     return typeof localStorage !== 'undefined';
//   }

//   public getPagePermissions(): any {
//     if (this.pagePermissionsCache) {
//         return this.pagePermissionsCache;
//     }

//     if (this.isLocalStorageAvailable()) {
//         const encryptedPagePermissions = localStorage.getItem(this.PAGE_PERMISSIONS);
//         // console.log("encryptedPagePermissions:", encryptedPagePermissions);
        
//         if (encryptedPagePermissions) {
//             const decryptedPagePermissions = EncryptorDecryptor.decryptUsingAES256(encryptedPagePermissions);
//             // console.log("decryptedPagePermissions:", decryptedPagePermissions);
            
//             // Ensure decryptedPagePermissions is a valid JSON string before parsing
//             if (decryptedPagePermissions && decryptedPagePermissions.trim()) {
//                 try {
//                     const pagePermissions = JSON.parse(decryptedPagePermissions);

//                     this.pagePermissionsCache = pagePermissions.map((permission: any) => ({
//                         mainMenuId: permission.mainMenuId,
//                         subMenuId: permission.subMenuId,
//                         processId: permission.processId,
//                         subProcessId: permission.subProcessId,
//                         actionId: permission.actionId
//                     }));

//                     return this.pagePermissionsCache;
//                 } catch (error) {
//                     console.error("Error parsing decryptedPagePermissions:", error);
//                 }
//             } else {
//                 console.warn("Decrypted page permissions is empty or invalid.");
//             }
//         }
//     }

//     return null;
// }


//   public clearPagePermissions(): void {
//     if (this.isLocalStorageAvailable()) {
//       localStorage.removeItem(this.PAGE_PERMISSIONS);
//     }
//     this.pagePermissionsCache = null;
//   }


//   public getPermissionsByPage(mainMenuId: number, subMenuId?: number, subProcessId?: number): any[] | null {
//     const permissions = this.getPagePermissions();
//     // console.log("page permissions",permissions);

//     if (!permissions) return null;
  
//     return permissions.filter(permission => 
//       permission.mainMenuId === mainMenuId &&
//       (subMenuId === undefined || permission.subMenuId === subMenuId) &&
//       (subProcessId === undefined || permission.subProcessId === subProcessId)
//     );
//   }
  

//   public hasPermission(actionIds: ActionPermission[]): boolean {

//     if(this.mainMenuId && this.subMenuId && !this.subProcessId){
//       const permissions = this.getPermissionsByPage(this.mainMenuId, this.subMenuId);
//       if (!permissions) return false;
//       return permissions.some(permission => actionIds.includes(permission.actionId));
//     }
    
//     else if(this.mainMenuId && !this.subMenuId && !this.subProcessId){
//       const permissions = this.getPermissionsByPage(this.mainMenuId);
//       if (!permissions) return false;
//       return permissions.some(permission => actionIds.includes(permission.actionId));
//     }
  
//      return false;
//   }

//   public hasAddPermission(): boolean {
//     const ADD_ACTION_IDS = [ActionPermission.Add, ActionPermission.AllPermissions];
//     return this.hasPermission(ADD_ACTION_IDS);
//   }

//   public hasEditPermission(): boolean {
//     const EDIT_ACTION_IDS = [ActionPermission.Edit, ActionPermission.AllPermissions];
//     return this.hasPermission(EDIT_ACTION_IDS);
//   }

//   public hasDeletePermission(): boolean {
//     const DELETE_ACTION_IDS = [ActionPermission.Delete, ActionPermission.AllPermissions];
//     return this.hasPermission(DELETE_ACTION_IDS);
//   }
// }




import { Injectable } from '@angular/core';
import { EncryptorDecryptor } from '../../class/encryptor-decryptor/encryptor-decryptor';
import { AuthService } from '../auth-services/auth.service';

export enum ActionPermission {
  Add = 3,
  Edit = 4,
  Delete = 5,
  AllPermissions = 6 
}

@Injectable({
  providedIn: 'root'
})
export class PagePermissionsService {

  private readonly MAIN_MENU_ID_KEY = 'MAIN_MENU_ID';
  private readonly SUB_MENU_ID_KEY = 'SUB_MENU_ID';
  private readonly SUB_PROCESS_ID_KEY = 'SUB_PROCESS_ID';
  private readonly PAGE_PERMISSIONS = 'PAGE_PERMISSIONS';

  private pagePermissionsCache: any[] | null = null;

  constructor(private authService: AuthService) {
    // Load stored IDs from localStorage when the service is initialized
    this.mainMenuId = this.getStoredId(this.MAIN_MENU_ID_KEY);
    this.subMenuId = this.getStoredId(this.SUB_MENU_ID_KEY);
    this.subProcessId = this.getStoredId(this.SUB_PROCESS_ID_KEY);
  }

  private mainMenuId: number | null = null;
  private subMenuId: number | null = null;
  private subProcessId: number | null = null;

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  // Store the ID in localStorage
  private storeId(key: string, value: number | null): void {
    if (this.isLocalStorageAvailable() && value !== null) {
      localStorage.setItem(key, value.toString());
    }
  }

  // Retrieve the ID from localStorage
  private getStoredId(key: string): number | null {
    if (this.isLocalStorageAvailable()) {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? parseInt(storedValue, 10) : null;
    }
    return null;
  }

  setMainMenuId(mainMenuId: number): void {
    this.mainMenuId = mainMenuId;
    this.storeId(this.MAIN_MENU_ID_KEY, mainMenuId);
  }

  setSubMenuId(subMenuId?: number): void {
    this.subMenuId = subMenuId ?? null;
    this.storeId(this.SUB_MENU_ID_KEY, this.subMenuId);
  }

  setSubProcessId(subProcessId: number): void {
    this.subProcessId = subProcessId ?? null;
    this.storeId(this.SUB_PROCESS_ID_KEY, this.subProcessId);
  }

  getMainMenuId(): number | null {
    return this.mainMenuId;
  }

  getSubMenuId(): number | null {
    return this.subMenuId;
  }

  getSubProcessId(): number | null {
    return this.subProcessId;
  }

  clearIds(): void {
    this.mainMenuId = null;
    this.subMenuId = null;
    this.subProcessId = null;
    
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.MAIN_MENU_ID_KEY);
      localStorage.removeItem(this.SUB_MENU_ID_KEY);
      localStorage.removeItem(this.SUB_PROCESS_ID_KEY);
    }
  }

  public getPagePermissions(): any {
    if (this.pagePermissionsCache) {
        return this.pagePermissionsCache;
    }

    if (this.isLocalStorageAvailable()) {
        const encryptedPagePermissions = localStorage.getItem(this.PAGE_PERMISSIONS);
        console.log("encryptedPagePermissions ", encryptedPagePermissions);
        if (encryptedPagePermissions) {
            //const decryptedPagePermissions = EncryptorDecryptor.decryptUsingAES256(encryptedPagePermissions);
            const decryptedPagePermissions = this.authService.decrypt(encryptedPagePermissions);
            if (decryptedPagePermissions && decryptedPagePermissions.trim()) {
                try {
                    const pagePermissions = JSON.parse(decryptedPagePermissions);

                    this.pagePermissionsCache = pagePermissions.map((permission: any) => ({
                        mainMenuId: permission.mainMenuId,
                        subMenuId: permission.subMenuId,               
                   }));

                    return this.pagePermissionsCache;
                } catch (error) {
                    console.error("Error parsing decryptedPagePermissions:", error);
                }
            } else {
                console.warn("Decrypted page permissions is empty or invalid.");
            }
        }
    }

    return null;
  }

  public clearPagePermissions(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.PAGE_PERMISSIONS);
    }
    this.pagePermissionsCache = null;
  }

  public getPermissionsByPage(mainMenuId: number, subMenuId?: number, subProcessId?: number): any[] | null {
    const permissions = this.getPagePermissions();
    
    if (!permissions) return null;
  
    return permissions.filter((permission:any) => 
      permission.mainMenuId === mainMenuId &&
      (subMenuId === undefined || permission.subMenuId === subMenuId) &&
      (subProcessId === undefined || permission.subProcessId === subProcessId)
    );
  }

  public hasPermission(actionIds: ActionPermission[]): boolean {

    if(this.mainMenuId && this.subMenuId && !this.subProcessId){
      const permissions = this.getPermissionsByPage(this.mainMenuId, this.subMenuId);
      // console.log("permissions",permissions);
      if (!permissions) return false;
      return permissions.some(permission => actionIds.includes(permission.actionId));
    }
    
    else if(this.mainMenuId && !this.subMenuId && !this.subProcessId){
      const permissions = this.getPermissionsByPage(this.mainMenuId);
      if (!permissions) return false;
      return permissions.some(permission => actionIds.includes(permission.actionId));
    }
  
     return false;
  }

  public hasAddPermission(): boolean {
    const ADD_ACTION_IDS = [ActionPermission.Add, ActionPermission.AllPermissions];
    return this.hasPermission(ADD_ACTION_IDS);
  }

  public hasEditPermission(): boolean {
    const EDIT_ACTION_IDS = [ActionPermission.Edit, ActionPermission.AllPermissions];
    return this.hasPermission(EDIT_ACTION_IDS);
  }

  public hasDeletePermission(): boolean {
    const DELETE_ACTION_IDS = [ActionPermission.Delete, ActionPermission.AllPermissions];
    return this.hasPermission(DELETE_ACTION_IDS);
  }
}

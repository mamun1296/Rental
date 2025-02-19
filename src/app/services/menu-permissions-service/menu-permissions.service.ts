import { Inject, Injectable } from '@angular/core';
import { EncryptorDecryptor } from '../../class/encryptor-decryptor/encryptor-decryptor';
import { AuthService } from '../auth-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuPermissionsService {
  private readonly MENU_PERMISSIONS = 'MENU_PERMISSIONS';
  private permissionsCache: any[] | null = null;
  constructor(
    private authService: AuthService
  ) {}


  public getMenuPermissions(): any {
    if (this.permissionsCache) {
      return this.permissionsCache;
    }

    if (typeof window !== 'undefined' && localStorage) {
      // const encryptedMenuPermissions = localStorage.getItem(this.MENU_PERMISSIONS);

      const decryptedMenuPermissions = localStorage.getItem(this.MENU_PERMISSIONS);
      //console.log("decryptedMenuPermissions ", decryptedMenuPermissions)
      if (decryptedMenuPermissions) {
        try {

          // const decryptedMenuPermissions = this.authService.decrypt(decryptedMenuPermissions);
          // console.log("decryptedMenuPermissions ", decryptedMenuPermissions);
          if(decryptedMenuPermissions != null){
            const menuPermissions = JSON.parse(decryptedMenuPermissions);

          //console.log("menuPermissions ", menuPermissions);
   
          this.permissionsCache = menuPermissions.map((permission: any) => ({
            id: permission.permissionID,
            permissionKey: permission.permissionKey,
            permissionName: permission.permissionName,
            permissionType: permission.permissionType,          
            mainMenuId: permission.mainMenuId,
            subMenuId: permission.subMenuId
          }));
         // console.log("this.permissionsCache ",   this.permissionsCache);
          return this.permissionsCache;
          }
        } catch (error) {
          console.error("Error decrypting or parsing menu permissions:", error);
          return null;
        }
      }
    }
    return null;
  }

  public clearMenuPermissions(): void {
    // Ensure 'localStorage' is defined
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.MENU_PERMISSIONS);
    }
    this.permissionsCache = null;
  }
  
}

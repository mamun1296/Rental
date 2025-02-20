import { Injectable } from '@angular/core';
import { EncryptorDecryptor } from '../../class/encryptor-decryptor/encryptor-decryptor';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private readonly USER = 'USER';
  private userCache: any | null = null;
 

  // public getUser(): any {
  //   if (this.userCache) {
  //     return this.userCache;
  //   }

  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     const encryptedUserData = localStorage.getItem(this.USER);

  //     if (encryptedUserData) {
  //       const decryptedUserData = EncryptorDecryptor.decryptUsingAES256(encryptedUserData);
  //       const userData = JSON.parse(decryptedUserData);

  //       this.userCache = {
  //         id: userData.id,
  //         userName: userData.userName,
  //         fullName: userData.fullName,
  //         email: userData.email,
  //         phoneNumber: userData.phoneNumber,
  //         organizationId: userData.organizationId,
  //         companyId: userData.companyId,
  //         divisionId: userData.divisionId,
  //         branchId: userData.branchId,
  //         roleIds: userData.roleIds,
  //         roles: userData.roles
  //       };

  //       return this.userCache;
  //     }
  //   }

  //   return null;
  // }

  public clearUserData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.USER);
    }
    this.userCache = null;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('ACCESS_TOKEN');
    }
    return null;
  }




pageConfigInit(id: any, pageSize: number, currentPage: number, totalItems: number): any {
  return {
    id: id,
    itemsPerPage: pageSize,
    currentPage: currentPage == 0 ? 1 : currentPage,
    totalItems: totalItems,
  };
}


// getuserprivileges(): any[] | null {
//     if (this.isUserAuthenticated()) {
//         const encryptprivileges = localStorage.getItem("userprivileges");
//         const usermenu = EncryptorDecryptor.decryptUsingAES256('encryptprivileges');
//         const userjson = (<any[]>JSON.parse(usermenu));
//         return userjson;
//     }
//     return null;
// }

public userSubject = new BehaviorSubject<any>(null);

public setUser(userData: any): void {
  this.userSubject.next(userData);
}


public getUser(): Observable<any> {
  return this.userSubject.asObservable();
}


public getDataStatus() {
  return ["Pending", "Approved"]
  return ["Pending", "Approved", "Recheck", "Checked", "Cancelled", "Rejected"]
}


}

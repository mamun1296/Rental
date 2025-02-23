import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../../services/routes-services/routes.service';


@Injectable({
  providedIn: 'root'
})
export class PermissionUserService {

 
  constructor(
    private routesService: RoutesService
  ) { }

  private controllerName = 'UserPermission';
  private getRolesAction = 'GetAllRoles';

  getAgencyEmployeesExtension<T>(agenyEmpID: any = '', agencyID: any = ''): Promise<T> {
    if (!agencyID) {
      console.error("Error: agencyID is not provided.");
      return Promise.reject("agencyID is required.");
    }  
    return this.routesService.promise_get<T>(
      `/${"AgencyEmployees"}/GetAgencyEmployeesExtension`,
      {
        responseType: "json",
        params: {
          agenyEmpID: agenyEmpID || '',
          agencyID: agencyID  
        },
      }
    );
  }

  getAllRoleApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${this.getRolesAction}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  SaveMenuPermissionApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveMenuPermission"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  addRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Roles"}/${"Add"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }

  updateRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Roles"}/${"Update"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }



  deleteRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Roles"}/${"Delete"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }


  getActivePermissionApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${"GetActivePermissions"}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  getRolePermissionsApi(params: any): Observable<any> {
    const url = `/${"Roles"}/${"RolePermissions"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

}

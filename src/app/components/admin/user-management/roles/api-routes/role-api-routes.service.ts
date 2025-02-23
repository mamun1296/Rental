import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../../../../services/routes-services/routes.service';


@Injectable({
  providedIn: 'root'
})
export class RoleApiRoutesService {

 
  constructor(
    private routesService: RoutesService
  ) { }

  private controllerName = 'Role';
  private getRolesAction = 'GetAllRoles';

  getAllRoleApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${this.getRolesAction}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  addRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"AddRole"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  updateRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateRole"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }



  deleteRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"DeleteRole"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }



  getActivePermissionApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${"GetActivePermissions"}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  getRolePermissionsApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${"RolePermissions"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

}

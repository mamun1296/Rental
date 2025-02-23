import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class PermissionRoutesService {
  
  constructor(
    private routesService: RoutesService
  ) { }

  private controllerName = 'Permission';
  getAllPermissionApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${'GetPermissionList'}`;
    return this.routesService.observable_get<any>(url, { params });
  }

 
  addPermissionApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${'SavePermission'}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  updatePermissionApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${'UpdatePermission'}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }
  deactivatePermissionApi(id: any, httpOptions: any={}):Observable<any>{
    const url = `/${this.controllerName}/DeactivatePermission?permissionID=${id}`;
    return this.routesService.observable_put<any>(url, id, httpOptions);
  }



}

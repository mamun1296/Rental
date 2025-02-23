import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { RoutesService } from '../../../../../../services/routes-services/routes.service';


@Injectable({
  providedIn: 'root'
})
export class UserRolesApiRoutesService {


  constructor(
    private routesService: RoutesService
  ) { }

  private controllerName = 'Roles';
  private getUserRolesAction = 'UserRoles';

  getAllUserRolesApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${this.getUserRolesAction}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  addUserRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Roles"}/${"Add"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  updateUserRoleApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Roles"}/${"Update"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }







}

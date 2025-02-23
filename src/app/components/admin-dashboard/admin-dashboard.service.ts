import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

 
  constructor(
    private routesService: RoutesService
  ) { }

  private controllerName = 'Access';
  private getUsersAction = '';

  getNotificationByUserApi(params: any): Observable<any> {
    const url = `/${this.controllerName}/${this.getUsersAction}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  getAgencyList(params: any) {
    const url = `/${"Access"}/${"GetAgencyInfo"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }

 getAdminList(params: any) {
  const url = `/${"Access"}/${"GetAdminInfo"}`;
  return this.routesService.observable_get<any>(url, {
      responseType: "json", observe: 'response', params: params
  });
 }

}

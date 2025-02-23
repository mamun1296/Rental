import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiRoutesService {

 
  constructor(
    private routesService: RoutesService
  ) { }

  private controllerName = 'GetNotification';
  private getUsersAction = 'GetNotificationsByUser';

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


  getUserRolesApi(params: any): Observable<any> {
    const url = `/${"Users"}/${"UserRoles"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

  
  addUserApi(userData: any[], httpOptions: any = {}): Observable<any> {
    const url = `/${"Users"}/${"Add"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  updateUserApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Users"}/${"Update"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }


  deleteUserApi(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"Users"}/${"Delete"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }
  

  getUsersApi(params: any): Observable<any> {
    const url = `/${"Users"}/${"GetAll"}`;
    return this.routesService.observable_get<any>(url, { params });
  }


  
  getAllRolesApi(params: any): Observable<any> {
    const url = `/${"Roles"}/${"GetAllRoles"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

  getAllCategoriesApi(params: any): Observable<any> {
    const url = `/${"Categories"}/${"GetCategories"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

  getUserCategoriesApi(params: any): Observable<any> {
    const url = `/${"Users"}/${"UserCategories"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

}

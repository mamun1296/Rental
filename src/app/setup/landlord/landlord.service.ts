import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';




@Injectable({
  providedIn: 'root'
})
export class LanlordService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Landlord";
 
//   get(params: any): Observable<any> {
//     const url = `/${this.controllerName}/${"GetAgency"}`;
//     return this.routesService.observable_get<any>(url, { params });
//   }

  
  getLandloardList(params: any) {
    const url = `/${this.controllerName}/${"GetLandlords"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }

  
  insert(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveLandlord"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  update(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateAgency"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
  }

  approval(payload: any, httpOptions: any = {}): Observable<any> {
    const url = `/Complain/SaveComplainApproval`;
    return this.routesService.observable_put<any>(url, payload, httpOptions);
  }
  



//   deleteVendorApi(userData: any, httpOptions: any = {}): Observable<any> {
//     const url = `/${"UpdateVendor"}/${"Delete"}`;
//     return this.routesService.observable_put<any>(url, userData, httpOptions);
//   }
  

//   getUsersApi(params: any): Observable<any> {
//     const url = `/${"Users"}/${"GetAll"}`;
//     return this.routesService.observable_get<any>(url, { params });
//   }


  
//   getAllRolesApi(params: any): Observable<any> {
//     const url = `/${"Roles"}/${"GetAllRoles"}`;
//     return this.routesService.observable_get<any>(url, { params });
//   }

//   getAllCategoriesApi(params: any): Observable<any> {
//     const url = `/${"Categories"}/${"GetCategories"}`;
//     return this.routesService.observable_get<any>(url, { params });
//   }

//   getUserCategoriesApi(params: any): Observable<any> {
//     const url = `/${"Users"}/${"UserCategories"}`;
//     return this.routesService.observable_get<any>(url, { params });
//   }

}

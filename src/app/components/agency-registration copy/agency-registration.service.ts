import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class AgencyRegistrationService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Access";
 
  get(params: any): Observable<any> {
    const url = `/${this.controllerName}/${"GetAgency"}`;
    return this.routesService.observable_get<any>(url, { params });
  }

  
  getAgencyList(params: any) {
    const url = `/${this.controllerName}/${"GetAgencyInfo"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }
//  getAgencyList(params: any): Observable<any> {
//   return this.http.post('/api/agencyList', params).pipe(
//     catchError((error) => {
//       console.error('API Error:', error);
//       return throwError(() => new Error('Failed to fetch agency list.'));
//     })
//   );
// }
  
  insert(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveAgencyInfo"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  update(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateAgency"}`;
    return this.routesService.observable_put<any>(url, userData, httpOptions);
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

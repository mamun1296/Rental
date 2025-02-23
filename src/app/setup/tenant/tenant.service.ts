import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class TenantService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Tenant";
   
  getPropertiesExtension<T>(propertyID: any = '', agencyID: any = ''): Promise<T> {
    if (!agencyID) {
      console.error("Error: agencyID is not provided.");
      return Promise.reject("agencyID is required.");
    }  
    return this.routesService.promise_get<T>(
      `/${this.controllerName}/GetPropertiesExtension`,
      {
        responseType: "json",
        params: {
          propertyID: propertyID || '',
          agencyID: agencyID  
        },
      }
    );
  }
  getTenantsExtension<T>(propertyID: any = '', agencyID: any = ''): Promise<T> 
  {
    if (!agencyID) {
      console.error("Error: agencyID is not provided.");
      return Promise.reject("agencyID is required.");
    }  
    return this.routesService.promise_get<T>(
      `/${this.controllerName}/GetTenantsExtension`,
      {
        responseType: "json",
        params: {
          propertyID: propertyID || '',
          agencyID: agencyID  
        },
      }
    );
  }
   getTenantsInfo(params: any) {
    const url = `/${this.controllerName}/${"GetTenantsInfo"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }



loadTenantsDetails(tenantInfoID: any, agencyID: any=''): Observable<any> {
  const url = `/${this.controllerName}/GetTenantsDetail?tenantInfoID=${tenantInfoID}&agencyID=${agencyID}`;
  return this.routesService.observable_get<any>(url, {
    responseType: "json", observe: 'response'
  });
} 

insert(userData: any, httpOptions: any = {}): Observable<any> {
  const url = `/${this.controllerName}/${"SaveTenants"}`;
  return this.routesService.observable_post<any>(url, userData, httpOptions);
}

update(userData: any, httpOptions: any = {}): Observable<any> {
  const url = `/${this.controllerName}/${"UpdateTenants"}`;
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

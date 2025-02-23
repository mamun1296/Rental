import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class PropertyService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Property";

  getLandlordsExtension<T>(landlordID: any = '', agencyID: any = ''): Promise<T> {
      if (!agencyID) {
        console.error("Error: agencyID is not provided.");
        return Promise.reject("agencyID is required.");
      }  
      return this.routesService.promise_get<T>(
        `/${this.controllerName}/GetLandlordsExtension`,
        {
          responseType: "json",
          params: {
            landlordID: landlordID || '',
            agencyID: agencyID,
          },
        }
      );
    }
  
  getItemsExtension<T>(itemID: any = '', agencyID: any = ''): Promise<T> {
    if (!agencyID) {
      console.error("Error: agencyID is not provided.");
      return Promise.reject("agencyID is required.");
    }  
    return this.routesService.promise_get<T>(
      `/${this.controllerName}/GetItemsExtension`,
      {
        responseType: "json",
        params: {
          itemID: itemID || '',
          agencyID: agencyID,
        },
      }
    );
  }
  

  
  getPropertyList(params: any) {
    const url = `/${this.controllerName}/${"GetPropertyList"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }



 getPropertyDetails(propertyID: any, agencyID: any=''): Observable<any> {
  const url = `/${this.controllerName}/GetPropertiesDetailList?propertyID=${propertyID}&agencyID=${agencyID}`;
  return this.routesService.observable_get<any>(url, {
    responseType: "json", observe: 'response'
  });
}

 

  insert(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveProperty"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  update(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateProperty"}`;
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

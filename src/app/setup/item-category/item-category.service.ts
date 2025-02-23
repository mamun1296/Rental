import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class ItemCategoryService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "ItemCategory";

  getList(params: any) { 
    const url = `/${this.controllerName}/${"GetItemList"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
  }



 getItemDetails(ItemID: any, agencyID: any=''): Observable<any> {
  const url = `/${this.controllerName}/GetPropertiesDetailList?ItemID=${ItemID}&agencyID=${agencyID}`;
  return this.routesService.observable_get<any>(url, {
    responseType: "json", observe: 'response'
  });
}

 

  insert(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveItem"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  update(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateItem"}`;
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

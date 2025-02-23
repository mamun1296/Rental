import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class ComplainService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Complain";
   
 

  getComplainInfo(params: any) {
    const url = `/${this.controllerName}/${"GetComplainInfo"}`;
    
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }

 getComplainDetails(params: any)
 {
  const url = `/${this.controllerName}/${"GetComplainDetail"}`;
  return this.routesService.observable_get<any>(url, {
    responseType: "json",observe: 'response',params: params});
 }
 solve(params:any, httpOptions: any = {}): Observable<any>{
  const url = `/${this.controllerName}/${"UpdateIsSolved"}`;
  return this.routesService.observable_put<any>(url, params, httpOptions);
}
//  getImagesAsBlob(images: any[]): Observable<string[]> {
//   if (!images || images.length === 0) {
//     return new Observable(observer => {
//       observer.next([]);
//       observer.complete();
//     });
//   }

//   const blobRequests = images.map(image =>
//     this.routesService.observable_get<Blob>(image.filePath, { responseType: 'blob' }).pipe(
//       map(blob => URL.createObjectURL(blob))
//     )
//   );

//   return forkJoin(blobRequests);
// }

loadComplainDetails(params: any): Observable<any> {
  const url = `/${this.controllerName}/GetComplainDetail`;
  return this.routesService.observable_get<any>(url, {
    responseType: "blob", observe: 'response', params: params
  });
} 

insert(userData: any, httpOptions: any = {}): Observable<any> {
  const url = `/${this.controllerName}/${"SaveComplain"}`;
  return this.routesService.observable_post<any>(url, userData, httpOptions);
}

update(userData: any, httpOptions: any = {}): Observable<any> {
  const url = `/${this.controllerName}/${"EditComplain"}`;
  return this.routesService.observable_put<any>(url, userData, httpOptions);
}

getComplainsExtension<T>(agencyID: any = '', propertyID:any='',tenantID:any=''): Promise<T> 
{
  if (!agencyID) {
    console.error("Error: agencyID is not provided.");
    return Promise.reject("agencyID is required.");
  }  
  return this.routesService.promise_get<T>(
    `/${this.controllerName}/GetComplainsExtension`,
    {
      responseType: "json",
      params: {
        agencyID: agencyID,
        propertyID: propertyID || '',
        tenantID: tenantID
      },
    }
  );
}
sendToLandlord(params:any, httpOptions: any = {}): Observable<any>{
  const url = `/${this.controllerName}/${"SendToLandlord"}`;
  return this.routesService.observable_put<any>(url, params, httpOptions);
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

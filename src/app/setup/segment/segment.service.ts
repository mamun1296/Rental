import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';



@Injectable({
  providedIn: 'root'
})
export class SegmentService{

  constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Segment";
   
  getPropertiesExtension<T>(propertyID: any = '', agencyID: any = '', landlordID: any = ''): Promise<T> {
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
          agencyID: agencyID,
          landlordID: landlordID,
        },
      }
    );
  }

  getSegmentsExtension<T>(segmentID: any = '', agencyID: any = '', landlordID: any = '', propertyID: any = ''): Promise<T> {
    if (!agencyID) {
      console.error("Error: agencyID is not provided.");
      return Promise.reject("agencyID is required.");
    }  
    return this.routesService.promise_get<T>(
      `/${this.controllerName}/GetSegmentsExtension`,
      {
        responseType: "json",
        params: {
          segmentID: segmentID || '',
          agencyID: agencyID,
          landlordID: landlordID,
          propertyID: propertyID
        },
      }
    );
  }  
  
  getItemsExtension<T>(itemID: any = '', agencyID: any = '', propertyID: any = '', segmentID: any = ''): Promise<T> {
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
          propertyID: propertyID,
          segmentID: segmentID
        },
      }
    );
  }

  getSegmentWiseItems(params: any) {
    const url = `/${this.controllerName}/${"GetSegmentWiseItemsInfo"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
 }



 loadSegmentWiseItemsDetails(segmentWiseItemID: any, agencyID: any=''): Observable<any> {
  const url = `/${this.controllerName}/GetSegmentWiseItemsDetail?segmentWiseItemID=${segmentWiseItemID}&agencyID=${agencyID}`;
  return this.routesService.observable_get<any>(url, {
    responseType: "json", observe: 'response'
  });
}

 

  insert(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveSegmentWiseItem"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  update(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateSegmentWiseItem"}`;
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

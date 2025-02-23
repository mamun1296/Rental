import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';


@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
 constructor(
    private routesService: RoutesService
  ) { }
   
  private controllerName = "Technician"; 

  getTechnicianCategoriesExtension<T>(technicianCategoryID: any = '', agencyID: any = ''): Promise<T> {
    if (!agencyID) {
      return Promise.reject("agencyID is required.");
    }  
    return this.routesService.promise_get<T>(
      `/${"TechnicianAccess"}/GetTechnicianCategoriesExtension`,
      {
        responseType: "json",
        params: {
          technicianCategoryID: technicianCategoryID || '',
          agencyID: agencyID  
        },
      }
    );
  }
  
  //------------------------------------Start Registration------------------------------------------

  registration(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${"TechnicianAccess"}/${"Registration"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
   }

   //------------------------------------End Registration------------------------------------------

   insert(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"SaveTechnician"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }

  
  getTechniciansInfo(params: any) {
    const url = `/${this.controllerName}/${"GetTechniciansInfo"}`;
    return this.routesService.observable_get<any>(url, {
        responseType: "json", observe: 'response', params: params
    });
  }

  approval(userData: any, httpOptions: any = {}): Observable<any>{
    const url = `/${this.controllerName}/${"ApproveTechnician"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }
  
  loadTechnicianDetails(params: any): Observable<any> {
  const url = `/${this.controllerName}/GetTechnicianDetail`;
  return this.routesService.observable_get<any>(url, {
    responseType: "json", observe: 'response', params: params
  });
  } 

 
  update(userData: any, httpOptions: any = {}): Observable<any> {
    const url = `/${this.controllerName}/${"UpdateTechnician"}`;
    return this.routesService.observable_post<any>(url, userData, httpOptions);
  }



  //------------------------------------End Registration------------------------------------------

//------------------------------------Start Login---------------------------------------------------
    
    getAgencyList(params: any) {
        const url = `/${this.controllerName}/${"GetAgencyInfo"}`;
        return this.routesService.observable_get<any>(url, {
            responseType: "json", observe: 'response', params: params
        });
    }

    loginApi(params: any): Observable<any> {
      const url = `/${"TechnicianAccess"}/${"Login"}`;
      return this.routesService.observable_post<any>(url, params, {
        responseType: 'json',
        headers: new HttpHeaders({ 'Content-Type': 'application/json','Skip-Interceptor': 'false' }),
      });
  }
  
  
  //   verifyTwoFactor(params: any): Observable<any> {
  //     const url = `/${this.controllerName}/${this.twoFactorAction}`;
  //     return this.routesService.observable_post<any>(url, params, {
  //       responseType: 'json',
  //       headers: { 'Skip-Interceptor': 'true' } 
  //     });
  //   }
    
  
  private logoutAction = 'Logout';
    logoutApi(params?: any): Observable<any> {
      const url = `/${"TechnicianAccess"}/${this.logoutAction}`;
      return this.routesService.observable_post<any>(url, params,{
        responseType: 'json',
      });
  }
    //------------------------------------End Login------------------------------------------
}

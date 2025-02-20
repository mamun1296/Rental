import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { RoutesService } from "../../services/routes-services/routes.service";



@Injectable({
    providedIn:'root'
})

export class LoginService{
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

    loginApi(params: any): Observable<any> {
        const url = `/${this.controllerName}/${"Login"}`;
        return this.routesService.observable_post<any>(url, params, {
          responseType: 'json',
          headers: new HttpHeaders({ 'Content-Type': 'application/json','Skip-Interceptor': 'false' }),
        });
    }
    

    private logoutAction = 'Logout';
      logoutApi(params?: any): Observable<any> {
        const url = `/${this.controllerName}/${this.logoutAction}`;
        return this.routesService.observable_post<any>(url, params,{
          responseType: 'json',
        });
    }

}
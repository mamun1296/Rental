import { Injectable } from '@angular/core';
import { RoutesService } from '../../../services/routes-services/routes.service';


@Injectable({
  providedIn: 'root'
})
export class TenantComplainServiceService {
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

 getComplainInfoForAgency(params: any) {
  const url = `/${this.controllerName}/${"GetComplainInfoForAgency"}`;
  
  return this.routesService.observable_get<any>(url, {
      responseType: "json", observe: 'response', params: params
  });
}

}

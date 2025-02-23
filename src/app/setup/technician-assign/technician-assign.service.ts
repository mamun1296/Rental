import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutesService } from '../../services/routes-services/routes.service';


@Injectable({
  providedIn: 'root'
})
export class TechnicianAssignService {

  constructor( private routesService: RoutesService) { 
  }
  private controllerName = "TechnicianAssign";
  insert(userData: any, httpOptions: any = {}): Observable<any> {
      const url = `/${this.controllerName}/${"AssignTechnician"}`;
      return this.routesService.observable_post<any>(url, userData, httpOptions);
    }
  
    getAssignedTechnician(params: any) {
      const url = `/${this.controllerName}/${"GetAssignedTechnicianInfo"}`;
      return this.routesService.observable_get<any>(url, {
          responseType: "json", observe: 'response', params: params
      });
   }
}

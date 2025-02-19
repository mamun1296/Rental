import { Injectable } from '@angular/core';
import { AppConstants } from '../../class/app-constants/app-constants';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutersService {
  apiURL: string = "http://152.89.106.226:9097/api";
  imageURL: string = "http://152.89.106.226:3350/";
  apiRoot: string = AppConstants.app_environment == "Local" ? "http://localhost:5000/api" :
  
    (AppConstants.app_environment == "Public" ? this.apiURL : "http://152.89.106.226:9097/api");

  imageRoot: string = AppConstants.app_environment == "Local" ? "http://localhost:5010/" : this.imageURL;

  constructor(private httpClient: HttpClient) { }

  observable_get_by_url<T>(url: string, httpOptions: {}): Observable<T> {
    return this.httpClient.get<T>(`${url}`, httpOptions);
  }

  observable_get<T>(url: string, httpOptions: {}): Observable<T> {
    return this.httpClient.get<T>(`${this.apiRoot}${url}`, httpOptions);
  }

  observable_post<T>(url: string, data: any, httpOptions: {}): Observable<T> {
    return this.httpClient.post<T>(`${this.apiRoot}${url}`, data, httpOptions);
  }

  observable_put<T>(url: string, data: any, httpOptions: {}): Observable<T> {
    return this.httpClient.put<T>(`${this.apiRoot}${url}`, data, httpOptions);
  }

  observable_delete<T>(url: string, httpOptions: {}): Observable<T> {
    return this.httpClient.delete<T>(`${this.apiRoot}${url}`, httpOptions);
  }

  observable_delete_data<T>(url: string, httpOptions: {}): Observable<T> {
    return this.httpClient.request<T>("delete", `${this.apiRoot}${url}`, httpOptions);
  }

  promise_get<T>(url: string, httpOptions: {}): Promise<T> {
    return firstValueFrom(this.httpClient.get<T>(`${this.apiRoot}${url}`, httpOptions));
  }
  
  promise_post<T>(url: string, data: any, httpOptions: {}): Promise<T> {
    return firstValueFrom(this.httpClient.post<T>(`${this.apiRoot}${url}`, data, httpOptions));
  }

  promise_put<T>(url: string, data: any, httpOptions: {}): Promise<T> {
    return firstValueFrom(this.httpClient.put<T>(`${this.apiRoot}${url}`, data, httpOptions));
  }

  promise_delete<T>(url: string, httpOptions: {}): Promise<T> {
    return firstValueFrom(this.httpClient.delete<T>(`${this.apiRoot}${url}`, httpOptions));
  }
}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from '../auth-services/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:5000/api/Messages/send';  // Your API endpoint

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Send a message to the API
  public sendMessage(receiverId: string, content: string): Observable<any> {
    const message = {
      receiverId: receiverId,
      content: content
    };

    return this.http.post<any>(this.apiUrl, message, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(this.authService.ACCESS_TOKEN)}`
      }
    });
  }
}

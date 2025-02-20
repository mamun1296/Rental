import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../auth-services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: signalR.HubConnection | undefined;

  public receivedMessages: string[] = [];

  constructor(private authService: AuthService) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public startConnection(): void {
    if (this.isBrowser()) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/api/notificationHub", {
          accessTokenFactory: () => localStorage.getItem(this.authService.ACCESS_TOKEN) || '',
          withCredentials: true
        })
        .build();

      this.hubConnection
        .start()
        .then(() => {
          // console.log('SignalR connection established');
          this.addMessageListener(); 
        })
        .catch(err => console.error('Error while starting connection: ' + err));
    } else {
      console.error('SignalR connection cannot be established in a non-browser environment.');
    }
  }

  private addMessageListener(): void {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveMessage', (message: string) => {
        // console.log('Received message:', message);
        this.handleMessage(message);
      });
    }
  }

  private handleMessage(message: string): void {
    this.receivedMessages.push(message); 
    console.log('Message received:', message);
    
  }

  public sendMessageToUser(userId: string, message: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke("SendMessageToUser", userId, message)
        .catch(err => console.error("Error sending message: ", err));
    }
  }

  public sendMessageToAll(message: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke("SendMessageToAll", message)
        .catch(err => console.error("Error broadcasting message: ", err));
    }
  }
}

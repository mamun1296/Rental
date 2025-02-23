import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SignalRService } from '../../services/notification/signal-r.service';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  receivedMessages: string[] = [];

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    // Start the SignalR connection when the component initializes
    this.signalRService.startConnection();

    // Subscribe to received messages
    this.receivedMessages = this.signalRService.receivedMessages;
  }

  ngOnDestroy(): void {
    // Stop the SignalR connection when the component is destroyed
    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.stop().catch(err => console.error('Error stopping connection: ' + err));
    }
  }

  // Send a message to a specific user
  sendMessageToUser(userId: string, message: string): void {
    this.signalRService.sendMessageToUser(userId, message);
  }

  // Broadcast a message to all connected users
  sendMessageToAll(message: string): void {
    this.signalRService.sendMessageToAll(message);
  }
}

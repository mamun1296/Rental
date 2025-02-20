import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  time: string; // Add a time field for display
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Sample notifications with title, description, and time
  private notifications: Notification[] = [
    { id: 1, title: 'New Message', message: 'You have a new message in your inbox. Click to read more details about the message.', isRead: false, time: '2 minutes ago' },
    { id: 2, title: 'System Alert', message: 'Your system has been successfully updated to the latest version.', isRead: false, time: '1 hour ago' },
    { id: 3, title: 'System Alert 2', message: 'Your system has been successfully updated to the latest version.', isRead: false, time: '1 hour ago' },
    { id: 4, title: 'System Alert 3', message: 'Your system has been successfully updated to the latest version.', isRead: false, time: '1 hour ago' },
    { id: 5, title: 'System Alert 4', message: 'Your system has been successfully updated to the latest version.', isRead: false, time: '1 hour ago' },
    { id: 6, title: 'System Alert 5', message: 'Your system has been successfully updated to the latest version.', isRead: false, time: '1 hour ago' },
    { id: 7, title: 'Promotion', message: 'There is a new promotion available! Check it out before it expires.', isRead: true, time: '3 hours ago' }
  ];

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return of(this.notifications);
  }

  markAsRead(id: number): Observable<void> {
    this.notifications = this.notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    return of();
  }
}

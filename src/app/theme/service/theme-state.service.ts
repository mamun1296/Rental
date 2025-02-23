import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeStateService {
  private isLightModeSubject = new BehaviorSubject<boolean>(true);
  isLightMode$: Observable<boolean> = this.isLightModeSubject.asObservable();

  setTheme(isLightMode: boolean): void {
    this.isLightModeSubject.next(isLightMode);
  }
}

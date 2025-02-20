import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  isHandset$: Observable<boolean>;
  isTablet$: Observable<boolean>;
  isWeb$: Observable<boolean>;
  isSmall$: Observable<boolean>;
  isMedium$: Observable<boolean>;
  isLarge$: Observable<boolean>;
  isXSmall$: Observable<boolean>;
  isXLarge$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches));

    this.isTablet$ = this.breakpointObserver
      .observe([Breakpoints.Tablet])
      .pipe(map((result) => result.matches));

    this.isWeb$ = this.breakpointObserver
      .observe([Breakpoints.Web])
      .pipe(map((result) => result.matches));

    this.isSmall$ = this.breakpointObserver
      .observe([Breakpoints.Small])
      .pipe(map((result) => result.matches));

    this.isMedium$ = this.breakpointObserver
      .observe([Breakpoints.Medium])
      .pipe(map((result) => result.matches));

    this.isLarge$ = this.breakpointObserver
      .observe([Breakpoints.Large])
      .pipe(map((result) => result.matches));

    this.isXSmall$ = this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches));

    this.isXLarge$ = this.breakpointObserver
      .observe([Breakpoints.XLarge])
      .pipe(map((result) => result.matches));
  }
}

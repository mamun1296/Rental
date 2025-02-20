

// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { LoaderService } from '../../services/loader-services/loader.service';
// import { of, throwError } from 'rxjs';
// import { catchError, delay, finalize, mergeMap } from 'rxjs/operators';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   const loaderService = inject(LoaderService);
//   // const excludedRoutes: string[] = ['/api/Access/Login']; 

//   const excludedRoutes: string[] = []; 

//   // Check if the current request URL is in the excluded routes
//   if (isExcludedRoute(req.url, excludedRoutes)) {
//     console.log(`Request to ${req.url} is excluded from loader.`);
//     loaderService.setLoadingState(false); // Set loader state to false for excluded routes
//     return next(req); // Skip loader for excluded routes
//   }

//   // Activate the loader for all other routes
//   // console.log(`Request to ${req.url} will activate the loader.`);
//   loaderService.setLoadingState(true);

//   const requestStartTime = Date.now();
//   const minimumLoadingTime = 500; // 0.5 second

//   return next(req).pipe(
//     mergeMap(event =>
//       of(event).pipe(delay(Math.max(0, minimumLoadingTime - (Date.now() - requestStartTime))))
//     ),
//     finalize(() => {
//       //console.log(`Request to ${req.url} is complete. Deactivating loader.`);
//       loaderService.setLoadingState(false);
//     }),
//     catchError(error => {
//       // console.log(`Request to ${req.url} encountered an error. Deactivating loader.`);
//       const elapsedTime = Date.now() - requestStartTime;
//       if (elapsedTime < minimumLoadingTime) {
//         return of(null).pipe(
//           delay(Math.max(0, minimumLoadingTime - elapsedTime)),
//           mergeMap(() => throwError(() => error))
//         );
//       } else {
//         return throwError(() => error);
//       }
//     })
//   );
// };

// function isExcludedRoute(url: string, excludedRoutes: string[]): boolean {
//   const urlPathname = new URL(url, location.origin).pathname;
//   const isExcluded = excludedRoutes.some(route => urlPathname === route);
//   // console.log(`Checking if ${urlPathname} is excluded: ${isExcluded}`);
//   return isExcluded;
// }




// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { LoaderService } from '../../services/loader-services/loader.service';
// import { of, throwError } from 'rxjs';
// import { catchError, delay, finalize, mergeMap } from 'rxjs/operators';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   const loaderService = inject(LoaderService);

//   const excludedRoutes: string[] = [];

//   if (isExcludedRoute(req.url, excludedRoutes)) {
//     console.log(`Request to ${req.url} is excluded from loader.`);
//     loaderService.setLoadingState(false);
//     return next(req);
//   }

//   // Delay loader activation by 5 seconds (5000ms)
//   const loaderDelay = 5000;
//   let loaderActivated = false;
//   const loaderTimeout = setTimeout(() => {
//     loaderService.setLoadingState(true);
//     loaderActivated = true;
//   }, loaderDelay);

//   const requestStartTime = Date.now();
//   const minimumLoadingTime = 500; // 0.5 second

//   return next(req).pipe(
//     mergeMap(event =>
//       of(event).pipe(delay(Math.max(0, minimumLoadingTime - (Date.now() - requestStartTime))))
//     ),
//     finalize(() => {
//       // Clear the loader activation timeout if the request completes before 5 seconds
//       clearTimeout(loaderTimeout);
//       if (loaderActivated) {
//         // Deactivate the loader if it was activated
//         loaderService.setLoadingState(false);
//       }
//     }),
//     catchError(error => {
//       clearTimeout(loaderTimeout);
//       if (loaderActivated) {
//         loaderService.setLoadingState(false);
//       }

//       const elapsedTime = Date.now() - requestStartTime;
//       if (elapsedTime < minimumLoadingTime) {
//         return of(null).pipe(
//           delay(Math.max(0, minimumLoadingTime - elapsedTime)),
//           mergeMap(() => throwError(() => error))
//         );
//       } else {
//         return throwError(() => error);
//       }
//     })
//   );
// };

// function isExcludedRoute(url: string, excludedRoutes: string[]): boolean {
//   const urlPathname = new URL(url, location.origin).pathname;
//   const isExcluded = excludedRoutes.some(route => urlPathname === route);
//   return isExcluded;
// }




// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { LoaderService } from '../../services/loader-services/loader.service';
// import { of, throwError } from 'rxjs';
// import { catchError, finalize } from 'rxjs/operators';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   const loaderService = inject(LoaderService);

//   const excludedRoutes: string[] = [];

//   if (isExcludedRoute(req.url, excludedRoutes)) {
//     console.log(`Request to ${req.url} is excluded from loader.`);
//     loaderService.setLoadingState(false);
//     return next(req);
//   }

//   // Delay loader activation by 5 seconds (5000ms)
//   const loaderDelay = 5000;
//   let loaderActivated = false;
//   const loaderTimeout = setTimeout(() => {
//     loaderService.setLoadingState(true);
//     loaderActivated = true;
//   }, loaderDelay);

//   return next(req).pipe(
//     finalize(() => {
//       // Clear the loader activation timeout if the request completes before 5 seconds
//       clearTimeout(loaderTimeout);
//       if (loaderActivated) {
//         // Deactivate the loader if it was activated
//         loaderService.setLoadingState(false);
//       }
//     }),
//     catchError(error => {
//       clearTimeout(loaderTimeout);
//       if (loaderActivated) {
//         loaderService.setLoadingState(false);
//       }
//       return throwError(() => error);
//     })
//   );
// };

// function isExcludedRoute(url: string, excludedRoutes: string[]): boolean {
//   const urlPathname = new URL(url, location.origin).pathname;
//   const isExcluded = excludedRoutes.some(route => urlPathname === route);
//   return isExcluded;
// }


import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LoaderService } from '../../services/loader-services/loader.service';
import { of, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const platformId = inject(PLATFORM_ID);

  const excludedRoutes: string[] = []; // Define excluded routes here

  // Handle SSR: Skip `location` usage when running on the server
  if (!isPlatformBrowser(platformId)) {
    console.log(`Skipping loader for SSR: ${req.url}`);
    return next(req);
  }

  // Check if the current request URL is in the excluded routes
  if (isExcludedRoute(req.url, excludedRoutes)) {
    console.log(`Request to ${req.url} is excluded from loader.`);
    loaderService.setLoadingState(false);
    return next(req);
  }

  // Delay loader activation by 5 seconds (5000ms)
  const loaderDelay = 5000;
  let loaderActivated = false;
  const loaderTimeout = setTimeout(() => {
    loaderService.setLoadingState(true);
    loaderActivated = true;
  }, loaderDelay);

  return next(req).pipe(
    finalize(() => {
      // Clear the loader activation timeout if the request completes before 5 seconds
      clearTimeout(loaderTimeout);
      if (loaderActivated) {
        // Deactivate the loader if it was activated
        loaderService.setLoadingState(false);
      }
    }),
    catchError(error => {
      clearTimeout(loaderTimeout);
      if (loaderActivated) {
        loaderService.setLoadingState(false);
      }
      return throwError(() => error);
    })
  );
};

// Safer implementation of `isExcludedRoute` to avoid using `location`
function isExcludedRoute(url: string, excludedRoutes: string[]): boolean {
  try {
    // Use a safer approach to parse the URL without relying on `location`
    const urlPathname = new URL(url, 'http://localhost').pathname; // Default to 'http://localhost' for SSR-safe URL parsing
    return excludedRoutes.some(route => urlPathname === route);
  } catch (error) {
    console.error(`Failed to parse URL: ${url}`, error);
    return false;
  }
}

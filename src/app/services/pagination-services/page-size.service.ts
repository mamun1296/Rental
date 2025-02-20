// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class PageSizeService {

//   generatePageSizeOptions(totalItems: number, currentPageSize: number, maxPageSize: number = 50): number[] {
//     let options: number[] = [];

//     // Ensure current page size is valid
//     if (currentPageSize >= 1 && currentPageSize <= totalItems && currentPageSize <= maxPageSize) {
//         options.push(currentPageSize);
//     }

//     // Generate page sizes in increments of 5, but cap at maxPageSize
//     for (let i = 10; i <= Math.min(totalItems, maxPageSize); i += 10) {
//         if (i !== currentPageSize) {
//             options.push(i);
//         }
//     }

//     // Add totalItems if it's not a multiple of 5 and within limits
//     if (totalItems % 10 !== 0 && totalItems > 5 && totalItems <= maxPageSize && totalItems !== currentPageSize) {
//         options.push(totalItems);
//     }

//     // Add totalItems if less than 5 and within limits
//     if (totalItems < 5 && totalItems <= maxPageSize && totalItems !== currentPageSize) {
//         options.push(totalItems);
//     }

//     // Sort and ensure the options do not exceed maxPageSize
//     options = options.filter(size => size <= maxPageSize);
//     options.sort((a, b) => a - b);

//     return options;
//   }
// }



import { Injectable, OnDestroy, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageSizeService {
  generatePageSizeOptions(totalItems: number, currentPageSize: number, maxPageSize: number = 50): number[] {
    let options: number[] = [];

    // If totalItems is less than or equal to 10, set the page size to the total number of items
    if (totalItems <= 10) {
      options.push(totalItems);
      return options;
    }

    // Ensure current page size is valid and add it to options
    if (currentPageSize >= 1 && currentPageSize <= totalItems && currentPageSize <= maxPageSize) {
      options.push(currentPageSize);
    }

    // Generate page sizes in increments of 10, but cap at maxPageSize
    for (let i = 10; i <= Math.min(totalItems, maxPageSize); i += 10) {
      if (i !== currentPageSize) {
        options.push(i);
      }
    }

    // Add totalItems if it's not a multiple of 10 and within limits
    if (totalItems % 10 !== 0 && totalItems <= maxPageSize && totalItems !== currentPageSize) {
      options.push(totalItems);
    }

    // Sort the options and ensure they do not exceed maxPageSize
    options = options.filter(size => size <= maxPageSize);
    options.sort((a, b) => a - b);

    return options;
  }
}
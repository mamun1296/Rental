import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { map } from 'rxjs';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatTooltipModule} from '@angular/material/tooltip';
import { ScreenSizeService } from '../../services/responsive-services/screen-size/screen-size.service';




@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule,FormsModule,
    CommonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatExpansionModule,
    MatTooltipModule

  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',

})
export class PaginationComponent {

  private screenSizeService = inject(ScreenSizeService);

  isHandset$ = this.screenSizeService.isHandset$;
  isTablet$ = this.screenSizeService.isTablet$;
  isWeb$ = this.screenSizeService.isWeb$;
  isSmall$ = this.screenSizeService.isSmall$;
  isMedium$ = this.screenSizeService.isMedium$;
  isLarge$ = this.screenSizeService.isLarge$;
  isXSmall$ = this.screenSizeService.isXSmall$;
  isXLarge$ = this.screenSizeService.isXLarge$;


  readonly panelOpenState = signal(true);
  

  constructor() {
     this.isHandset$.subscribe((isHandset) => {
      this.panelOpenState.set(!isHandset);
    });
  }

  
  @Input() totalPages!: number;
  @Input() currentPage!: number;
  @Input() items!: number;
  @Input() pageSizeOptions!: number[];
  @Input() pageSize!: number;
  @Input() minPagesToShow!: number; 
  @Input() minCurrentPage!: number; 
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  getPaginationArray(): number[] {
    if (!this.totalPages) return [];

    if (this.totalPages <= this.minPagesToShow) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    let startPage: number;
    let endPage: number;

    if (this.currentPage <= this.minCurrentPage) {
      startPage = 1;
      endPage = this.minPagesToShow;
    } else if (this.currentPage >= this.totalPages - 1) {
      startPage = this.totalPages - 1;
      endPage = this.totalPages;
    } else {
      startPage = this.currentPage - 1;
      endPage = this.currentPage + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }





  goToPage(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  changePageSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newSize = Number(selectElement.value);
    this.pageSizeChange.emit(newSize);
  }

  


}

import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { ItemResponsiveService } from '../../services/responsive-services/item/item-responsive.service';
import { ScreenSizeService } from '../../services/responsive-services/screen-size/screen-size.service';
import { UserService } from '../../services/user-services/user.service';
// import { ItemResponsiveService } from '../services/responsive-services/item/item-responsive.service';
// import { ScreenSizeService } from '../services/responsive-services/screen-size/screen-size.service';
// import { UserService } from '../services/user-services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  animations: [
    trigger('iconChange', [
      state('expanded', style({
        transform: 'rotate(360deg)',
      })),
      state('collapsed', style({
        transform: 'rotate(0deg)',
      })),
      transition('expanded <=> collapsed', animate('200ms ease-in-out')),
    ]),
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,

  ]
})
export class DashboardComponent {

  constructor(
    private itemResponsiveService: ItemResponsiveService
  ){}


  private screenSizeService = inject(ScreenSizeService);

  isHandset$ = this.screenSizeService.isHandset$;
  isTablet$ = this.screenSizeService.isTablet$;
  isWeb$ = this.screenSizeService.isWeb$;
  isSmall$ = this.screenSizeService.isSmall$;
  isMedium$ = this.screenSizeService.isMedium$;
  isLarge$ = this.screenSizeService.isLarge$;
  isXSmall$ = this.screenSizeService.isXSmall$;
  isXLarge$ = this.screenSizeService.isXLarge$;



  private breakpointObserver = inject(BreakpointObserver);


  isColsExpanded: boolean[] = [false, false, true];
  isRowsExpanded: boolean[] = [false, false, false];

  isHandset: boolean = false;
  isXSmall: boolean = false;
  isLarge: boolean = false;
  isSmall: boolean = false;
  cols: number = 2; 

  toggleCardExpansion(cardIndex: number) {
    this.isColsExpanded[cardIndex] = !this.isColsExpanded[cardIndex];
  }

  toggleRowExpansion(cardIndex: number) {
    this.isRowsExpanded[cardIndex] = !this.isRowsExpanded[cardIndex];
  }

  removeCard(cardIndex: number) {
    this.isColsExpanded[cardIndex] = false;
    this.isRowsExpanded[cardIndex] = false;
  }

  cols$ = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge,
    Breakpoints.Handset,
    Breakpoints.Tablet,
    Breakpoints.Web,
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait,
    Breakpoints.WebPortrait,
    Breakpoints.HandsetLandscape,
    Breakpoints.TabletLandscape,
    Breakpoints.WebLandscape,
  ]).pipe(
    map((result) => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols = 1;
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.cols = 2;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 2;
      } else if (result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 2;
      } else {
        this.cols = 2;
      }
      this.updateColsExpansion();
      return this.cols;
    })
  );


  cols2: number = 2;

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.XSmall,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      this.isHandset = result.breakpoints[Breakpoints.Handset];
      this.isSmall = result.breakpoints[Breakpoints.Small];
      this.isXSmall = result.breakpoints[Breakpoints.XSmall];
      this.isLarge = result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge];
      this.updateColsExpansion();
    });

    // this.userService.getUser();
    

    this.itemResponsiveService.cols$.subscribe(cols => {
      this.cols2 = cols;
    });


  }

  private updateColsExpansion() {
    if (this.isHandset || this.isXSmall) {
      this.isColsExpanded = [true, true, true];
    } else if (this.isSmall) {
      this.isColsExpanded = [false, false, true];
    }else if (this.isLarge) {
      this.isColsExpanded = [false, false, true];
    }
  }

  getColspan(cardIndex: number): number {
    // Ensure colspan is not greater than the number of columns
    return this.isColsExpanded[cardIndex] ? Math.min(2, this.cols) : 1;
  }




  public userService = inject(UserService);
  //currentUser$ = this.userService.currentUser$;




  
  tabs = [
   // { label: 'Administration', disabled: false },
    // { label: 'Attendance', disabled: false },
    // { label: 'Leave', disabled: false },
    // { label: 'Payroll', disabled: false }
  ];
  
  
  selectedTabIndex = 1;

  

}

import { Component, inject } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';


import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../../../breadcrumb/breadcrumb.component';
import { NotificationComponent } from '../../../notification/notification.component';
import { ItemResponsiveService } from '../../../../services/responsive-services/item/item-responsive.service';
import { ScreenSizeService } from '../../../../services/responsive-services/screen-size/screen-size.service';
// import { BreadcrumbComponent } from 'src/app/components/shared/breadcrumb/breadcrumb.component';
// import { ItemResponsiveService } from 'src/app/services/responsive-services/item/item-responsive.service';
// import { ScreenSizeService } from 'src/app/services/responsive-services/screen-size/screen-size.service';
// import { NotificationComponent } from 'src/app/components/shared/notification/notification.component';


@Component({
  selector: 'app-user-management-dashboard',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    RouterModule,
    RouterOutlet
  ],
  templateUrl: './user-management-dashboard.component.html',
  styleUrl: './user-management-dashboard.component.scss'
})
export class UserManagementDashboardComponent {

  breadcrumbs = [
    // { label: 'Admin', link: '/admin' },
    { label: 'User', text: 'User Management' }
  ];
  
  constructor(
    private itemResponsiveService: ItemResponsiveService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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


   // Get the current route path to determine the selected tab index
   const currentRoute = this.activatedRoute.snapshot.firstChild?.url?.[0]?.path;

   if (currentRoute) {
     // Check if the current route matches a tab label
     this.selectedTabIndex = this.tabs.findIndex(tab => tab.label.toLowerCase() === currentRoute.toLowerCase());
   }

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
    return this.isColsExpanded[cardIndex] ? Math.min(2, this.cols) : 1;
  }


  tabs = [
    // { 
    //   label: 'User', 
    //   icon: 'person', 
    //   description: 'Manage user accounts', 
    //   disabled: false
    // },
    { 
      label: 'Role', 
      icon: 'admin_panel_settings', 
      description: 'Manage roles and permissions', 
      disabled: false  
    }
  ];

  selectedTabIndex =0;
  onTabChanged(event: MatTabChangeEvent): void {

    // console.log('Tab changed to:', event.tab.textLabel);

    this.selectedTabIndex = event.index;

    const selectedTabLabel = this.tabs[event.index].label.toLowerCase();
    this.router.navigate([`/user-management/${selectedTabLabel}`]);
  }

}

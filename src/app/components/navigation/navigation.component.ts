
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

// ----------------------------------- Material
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ThemeSwitcherService } from '../theme/service/theme-switcher.service';



import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { UserService } from '../services/user-services/user.service';
// import { AuthService } from '../services/auth-services/auth.service';
import { MenuItem } from './interface/menu-item';
import { MatTooltip } from '@angular/material/tooltip';
import { ScreenSizeService } from '../../services/responsive-services/screen-size/screen-size.service';
import { AuthService } from '../../services/auth-services/auth.service';
import { UserService } from '../../services/user-services/user.service';
import { PagePermissionsService } from '../../services/page-permissions-service/page-permissions.service';
import { ThemeSwitcherService } from '../../theme/service/theme-switcher.service';
import { ThemeStateService } from '../../theme/service/theme-state.service';
import { MenuPermissionsService } from '../../services/menu-permissions-service/menu-permissions.service';
import { NotificationService } from '../../services/notification/notification.service';
import { SharedmethodService } from '../../services/shared-method/sharedmethod.service';
import { SignalRService } from '../../services/notification/signal-r.service';
import { LeftsidebarComponent } from "../admin/leftsidebar/leftsidebar.component";
import { HeaderComponent } from "../admin/header/header.component";
import { FooterComponent } from "../admin/footer/footer.component";
import { ChatboxComponent } from "../admin/chatbox/chatbox.component";
import { RightsidebarComponent } from "../admin/rightsidebar/rightsidebar.component";
// import { ThemeStateService } from '../theme/service/theme-state.service';
// import { PagePermissionsService } from '../services/page-permissions-service/page-permissions.service';
// import { MenuPermissionsService } from '../services/menu-permissions-service/menu-permissions.service';
// import { NotificationService } from '../services/notification/notification.service';

// import { SharedmethodService } from '../services/shared-method/sharedmethod.service';
// import { SignalRService } from '../services/notification/signal-r.service';


interface Menu {
  title: string;
  icon: string;
  path?: string;
  active?: boolean;
  expanded?: boolean;
  mainMenuId?: number; // Add mainMenuId
  subMenuId?: number;  // Add subMenuId
  submenus?: Menu[];
  subSubMenu?: Menu[];
  subSubMenuId?: number;
  registrationType?: string;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss','./slide-toggle.scss', './menu.scss', './mat-drawer.scss','./notification.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LeftsidebarComponent,
    HeaderComponent,
    FooterComponent,
    ChatboxComponent,
    RightsidebarComponent
],
  providers: [
    JwtHelperService
  ]
})
export class NavigationComponent implements OnInit {

  private screenSizeService = inject(ScreenSizeService);

  isHandset$ = this.screenSizeService.isHandset$;
  isTablet$ = this.screenSizeService.isTablet$;
  isWeb$ = this.screenSizeService.isWeb$;
  isSmall$ = this.screenSizeService.isSmall$;
  isMedium$ = this.screenSizeService.isMedium$;
  isLarge$ = this.screenSizeService.isLarge$;
  isXSmall$ = this.screenSizeService.isXSmall$;
  isXLarge$ = this.screenSizeService.isXLarge$;



  private authService = inject(AuthService);
  public userService = inject(UserService);
  private router = inject(Router);

  private pagePermissionsService = inject(PagePermissionsService);

  
  // -------------------------------------- >>>
  // ------------------- Theme Start

  themeSwitcher = inject (ThemeSwitcherService)
  private themeStateService = inject(ThemeStateService);

  private menuPermissionsService = inject(MenuPermissionsService);
  private notificationService = inject(NotificationService);
  private sharedmethodService = inject(SharedmethodService);

  isLightMode = true;
  @Output() darkModeChanged = new EventEmitter<boolean>();

  user: any;


  // --------------------------------------- notification
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;


  constructor(private signalRService: SignalRService,){

    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('user-theme');
      
      if (savedTheme) {
        this.isLightMode = savedTheme === 'themeLight';
      } else {
        this.isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
      }

      this.themeSwitcher.setTheme(this.isLightMode);
      this.themeStateService.setTheme(this.isLightMode);
    }
  }

  public messages: string[] = [];

  loginRole: any;
  loginName: any;
  email: any;
  contactNumber: any;

  ngOnInit(): void {
    this.getUserLoginData();   
    this.loginRole = this.userLoginData.registrationType;
    this.loginName = this.userLoginData.employeeName;
    this.email = this.userLoginData.email;
    this.contactNumber = this.userLoginData.contactNumber;
    this.user = this.userService.getUser();

  
    // Check if running in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Load the saved theme when the component initializes
      const savedTheme = localStorage.getItem('user-theme');
      
      if (savedTheme) {
        this.isLightMode = savedTheme === 'themeLight';
      } else {
        // Default to the system theme
        this.isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
      }
      
      this.themeSwitcher.setTheme(this.isLightMode);
      this.themeStateService.setTheme(this.isLightMode);
    } else {
      // Fallback behavior when not in a browser environment
      this.isLightMode = false; // or any other default value
      this.themeSwitcher.setTheme(this.isLightMode);
      this.themeStateService.setTheme(this.isLightMode);
    }


    // this.pagePermissionsService.getPagePermissions();

    // this.permissions = this.menuPermissionsService.getMenuPermissions();
    // if (this.permissions) {
    //   console.log("Menu permissions", this.permissions);
    // }

    this.fetchAndFilterMenus();

    this.loadNotifications();

    //this.getNotificationByUser();


    this.sharedmethodService.methodCall$.subscribe(() => {
        //this.getNotificationByUser();
      });
    

      // setInterval(() => {
      //   this.getNotificationByUser();
      // }, 5000);

      // this.signalRService.startConnection();
      
  }

/**
   * Fetches permissions and filters menus based on those permissions and active status.
   */


fetchAndFilterMenus(): void {
  this.permissions = this.menuPermissionsService.getMenuPermissions(); // Fetch permissions
  this.filteredMenus = this.filterMenusBasedOnPermissions();
}

filterMenusBasedOnPermissions(): Menu[] {
  return this.menus
    .filter(menu => menu.active) // Include active main menus
    .map(menu => {
      const hasMainMenuPermission = this.permissions.some(permission => permission.mainMenuId === menu.mainMenuId);

      if (menu.submenus && menu.submenus.length > 0) {
        const filteredSubmenus = menu.submenus.filter(
          submenu =>
            submenu.active &&
            this.permissions.some(
              permission =>
                permission.mainMenuId === menu.mainMenuId && permission.subMenuId === submenu.subMenuId
            )
        );

        if (filteredSubmenus.length > 0) {
          return { ...menu, submenus: filteredSubmenus };
        }
      } else if (hasMainMenuPermission) {
        return menu;
      }

      return null;
    })
    .filter(menu => menu !== null) as Menu[];
}

// fetchAndFilterMenus(): void {
//   this.permissions = this.menuPermissionsService.getMenuPermissions();
//   if (this.permissions) {
//     // console.log("Fetched permissions:", this.permissions);

//     // Call the method to filter menus based on permissions
//     this.filteredMenus = this.filterMenusBasedOnPermissions();
//     //console.log("Filtered menus:", this.filteredMenus);
//   }
// }

// /**
//  * Filters menus based on permissions and active status.
//  */
// filterMenusBasedOnPermissions(): Menu[] {
//   return this.menus
//     .filter(menu => menu.active) // Only consider active main menus
//     .map(menu => {
//       // Check if any permission matches the mainMenuId
//       const mainMenuPermissionExists = this.permissions.some(permission => permission.mainMenuId === menu.mainMenuId);

//       if (menu.submenus && menu.submenus.length) {
//         // Filter active submenus that match both mainMenuId and subMenuId
//         const filteredSubmenus = menu.submenus
//           .filter(submenu => submenu.active) // Only consider active submenus
//           .filter(submenu =>
//             this.permissions.some(permission =>
//               permission.mainMenuId === menu.mainMenuId &&
//               permission.subMenuId === submenu.subMenuId
//             )
//           );

//         // Log the filtered submenus
//         if (filteredSubmenus.length > 0) {
//           console.log(`Menu "${menu.title}" has matching active submenus:`, filteredSubmenus);
//           return {
//             ...menu,
//             submenus: filteredSubmenus
//           };
//         } else {
//           // console.log(`Menu "${menu.title}" has no matching active submenus.`);
//         }
//       } else if (mainMenuPermissionExists) {
//         // If no submenus, return the menu if mainMenuId matches and it's active
//          //console.log(`Menu "${menu.title}" is visible based on mainMenuId and is active.`);      
//         return menu;
//       }

//       // console.log(`Menu "${menu.title}" is not visible.`);
//       return null; // Exclude menus that don't match permissions
//     })
//     .filter(menu => menu !== null); // Remove any null entries
//   }

 // private notificationApiRoutesService = inject(NotificationApiRoutesService);

  listOfNotication: any[] = [];
  userId: any;


  // getNotificationByUser(): void {
  //   const params: any = {};

  //   if (this.userId) {
  //     params['userId'] = this.userId;
  //   }

  //   this.notificationApiRoutesService.getNotificationByUserApi(params).subscribe({
  //     next: (response: any) => {
  //       this.listOfNotication = response.data;
  //       console.log('listOfNotication:', this.listOfNotication);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching Notification:', error);
  //     },
  //   });
  // }


  loadNotifications(): void {
    // Load notifications from the service
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      // Count the unread notifications
      this.unreadCount = notifications.filter(n => !n.isRead).length;
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(id: number): void {
    // Mark a notification as read
    this.notificationService.markAsRead(id).subscribe(() => {
      this.loadNotifications();
    });
  }

  deleteNotification(notificationId: number) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateUnreadCount();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.updateUnreadCount();
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }


  toggle() {
    this.isLightMode = !this.isLightMode;
    this.darkModeChanged.emit(this.isLightMode);

    this.themeSwitcher.setTheme(this.isLightMode);
    this.themeStateService.setTheme(this.isLightMode);
    
    // Save the user's theme preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user-theme', this.isLightMode ? 'themeLight' : 'themeDark');
    }
  }
  

  // -------------------------------------- >>>
  // ------------------- Theme End


  


  // ...............................................................
  // ........................ Variable Area Start
  // ...............................................................




  // ...............................................................
  // ........................ Variable Area End
  // ...............................................................
  
  @ViewChild("changePasswordModal", { static: false }) changePasswordModal !: ElementRef;
  @ViewChild("changeDefaultPasswordModal", { static: false }) changeDefaultPasswordModal !: ElementRef;
  userInfo: any = null;

    photoPath : string="default-images/user.png";


    




    isCurrentPasswordView?: boolean;
    click_CurrentPasswordView() {
      this.isCurrentPasswordView = !this.isCurrentPasswordView
    }
  
    isNewPasswordView?: boolean;
    click_NewPasswordView() {
      this.isNewPasswordView = !this.isNewPasswordView
    }
  
    isConfirmPasswordView?: boolean;
    click_ConfirmPasswordView() {
      this.isConfirmPasswordView = !this.isConfirmPasswordView
    }
  
    logOut() {
      this.authService.logOut()
    }
    

    currentUser: any;
    refreshToken(){
      this.authService.refreshToken();
    }
  
  
    btnChangePassword: boolean = false;

    userLoginData: any;
    getUserLoginData(): void {
      const storedUserData = localStorage.getItem('userLoginData');
      if (storedUserData) {
        this.userLoginData = JSON.parse(storedUserData);
      } else {
        console.error('No user data found in localStorage.');
      }
    }
    

  permissions: any[] = [];
  filteredMenus: Menu[] = [];
  
  menus: Menu[] = [   
    {
      title: 'Administrator',
      icon: 'admin_panel_settings',
      active: true,
      expanded: false,
      mainMenuId: 1,
      submenus: [
        { title: 'Dashboard', icon: 'dashboard', path: '/admin-dashboard', active: true, subSubMenuId: 1 },             
      ],   
    },
    {
      title: 'Agency',
      icon: 'admin_panel_settings',
      active: true,
      expanded: false,
      mainMenuId: 2,
      submenus: [   
          { title: 'Dashboard', icon: 'dashboard', path: '/agency-dashboard', active: true, subMenuId: 1 },      
          { title: 'Permission', icon: 'fiber_manual_record', path: '/permission', active: true, subMenuId: 2 },
          // { title: 'User Management', icon: 'fiber_manual_record', path: '/user-management/user', active: true, subMenuId: 3 },
          { title: 'Role Management', icon: 'fiber_manual_record', path: '/user-management/role', active: true, subMenuId: 4 },
          { title: 'Menu Distribution', icon: 'fiber_manual_record', path: '/menu-distribution', active: true, subMenuId: 5 },              
          { title: 'Edit Info', icon: 'fiber_manual_record', path: '/edit-information', active: true, subMenuId: 6 },       
          { title: 'Employee', icon: 'fiber_manual_record', path: '/agency-employees', active: true, subMenuId: 7 },
          { title: 'Landlord', icon: 'fiber_manual_record', path: '/landlord', active: true, subMenuId: 8  },
          { title: 'Property', icon: 'fiber_manual_record', path: '/property', active: true, subMenuId: 9 },        
          { title: 'Tenant', icon: 'fiber_manual_record', path: '/tenant', active: true, subMenuId: 10  },   
          { title: 'Technician Category', icon: 'fiber_manual_record', path: '/technician-category', active: true, subMenuId: 11 }, 
          { title: 'Technician Onboard', icon: 'fiber_manual_record', path: '/technician-onboarding', active: true, subMenuId: 12 },   
          { title: 'Approve Technician', icon: 'fiber_manual_record', path: '/technician-approval', active: true, subMenuId: 13 },
          { title: 'Complain', icon: 'fiber_manual_record', path: '/complain', active: true, subMenuId: 14},
          { title: 'Assigned Technician list', icon: 'fiber_manual_record', path: '/assigned-technician-list', active: true, subMenuId: 15},

          {
            title: 'Report',
            icon: 'assessment',
            active: true,
            expanded: false,
            mainMenuId: 3,
            submenus: [       
              { title: 'Report 1 Detail', icon: 'fiber_manual_record', path: '/reports/report1/detail', active: true, subSubMenuId: 1 },
              { title: 'Report 1 Analysis', icon: 'fiber_manual_record', path: '/reports/report1/analysis', active: true, subSubMenuId: 2 }   
            ]
          },  
      ]
    },

    // {
    //   title: 'Operation',
    //   icon: 'work_history',
    //   active: true,
    //   expanded: false,
    //   mainMenuId: 3,
    //   submenus: [       
    //     { title: 'Landlord', icon: 'fiber_manual_record', path: '/landlord', active: true, subMenuId: 1  },
    //     { title: 'Property', icon: 'fiber_manual_record', path: '/property', active: true, subMenuId: 2 },        
    //     { title: 'Tenant', icon: 'fiber_manual_record', path: '/tenant', active: true, subMenuId: 3  },   
    //     { title: 'Technician Category', icon: 'fiber_manual_record', path: '/technician-category', active: true, subMenuId: 4 }, 
    //     { title: 'Technician Onboarding', icon: 'fiber_manual_record', path: '/technician', active: true, subMenuId: 5  }, 
       
    //   ]
    // },  
  
    {
      title: 'Landlord',
      icon: 'apartment',
      active: true,
      expanded: false,
      mainMenuId: 4,
      submenus: [   
        { title: 'Complain List', icon: 'fiber_manual_record', path: '/complain-list', active: true, subSubMenuId: 1 },    

      ]
    },

   
    {
      title: 'Tenant',
      icon: 'apartment',
      active: true,
      expanded: false,
      mainMenuId: 5,
      submenus: [    
        { title: 'Complain List', icon: 'fiber_manual_record', path: '/complain-list', active: true, subSubMenuId: 1 },
      ],   
    },  
  
  ];


  toggleSubMenu(menu: Menu) {
    menu.expanded = !menu.expanded;
  }

  onMenuClick(mainMenuId: any, subMenuId?: any) {

    this.pagePermissionsService.setMainMenuId(mainMenuId);
    this.pagePermissionsService.setSubMenuId(subMenuId);

  }


  hasPermission(mainMenuId: number, subMenuId?: number): boolean {
    // Check if permissions array is availabl
    // console.log("mainMenuId",mainMenuId, "mainMenuId",subMenuId);
  return true;
  }


 // Method to get visible menus based on permissions
  getVisibleMenus(menus: Menu[]): Menu[] {
    // console.log("menus ", menus);
        
    var menu = menus.filter(menu => menu.active);
    // console.log("menu ", menu);
    return menu;
  }
  
  
  

}

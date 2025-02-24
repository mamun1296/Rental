import { Routes } from '@angular/router';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AgencyDashboardComponent } from './components/agency-dashboard/agency-dashboard.component';
import { AgencyEditComponent } from './components/agency-edit/agency-edit.component';
import { AgencyEmployeesComponent } from './components/admin/agency-employees/agency-employees.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PermissionComponent } from './components/admin/permission/list/permission.component';
import { PermissionUserComponent } from './components/admin/permision-user/list/permission-user.component';
import { UserManagementDashboardComponent } from './components/admin/user-management/dashboard/user-management-dashboard.component';
import { UserComponent } from './components/admin/user-management/users/user/list/user.component';
import { RoleComponent } from './components/admin/user-management/roles/role/list/role.component';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { LandlordComponent } from './setup/landlord/landlord.component';
import { PropertyComponent } from './setup/property/list/property.component';
import { EditComplainComponent } from './setup/landlord/complain-list/edit-complain/edit-complain.component';
import { LayoutContainerComponent } from './components/primary-layout/layout-container.component';
import { TenantDashboardComponent } from './setup/tenant/dashboard/tenant-dashboard.component';
import { LandlordDashboardComponent } from './setup/landlord/dashboard/landlord-dashboard.component';
import { AssignedTechnicianListComponent } from './setup/assign-technician/assigned-technician-list/assigned-technician-list.component';
import { AssignTechnicianComponent } from './setup/assign-technician/list/assign-technician.component';
import { TechnicianApprovalComponent } from './setup/technician/approval/technician-approval.component';
import { TechnicianCategoryComponent } from './setup/technician-category/list/technician-category.component';
import { TechnicianComponent } from './setup/technician/list/technician.component';
import { RegistrationTechnicianComponent } from './setup/technician/registration/registration-technician.component';
import { ComplainComponent } from './setup/complain/list/complain.component';
import { TenantComponent } from './setup/tenant/list/tenant.component';
import { SegmentComponent } from './setup/segment/list/segment.component';
import { ItemCategoryComponent } from './setup/item-category/item-category.component';
import { ItemComponent } from './setup/item/item.component';


export const routes: Routes = [
  { path: '', redirectTo: '/layout-container', pathMatch: 'full' },
  { path: 'layout-container', component: LayoutContainerComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  {

    path: '',
    component: NavigationComponent,
    children: [        
     { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
     { path: 'admin-dashboard',  component: AdminDashboardComponent},
     { path: 'agency-dashboard',  component: AgencyDashboardComponent, data: { requiredPermission: '/agency-dashboard'} },
     { path: 'edit-information',  component: AgencyEditComponent, data: { requiredPermission: '/edit-information'}},
     { path: 'agency-employees',  component: AgencyEmployeesComponent },
     { path: 'dashboard', component: DashboardComponent },
     
     { path: 'permission', component: PermissionComponent},
     { path: 'menu-distribution', component: PermissionUserComponent},

     { path: 'user-management', component: UserManagementDashboardComponent},
     // Lazy load user-management component and its child components
     {
       path: 'user-management',
       component: UserManagementDashboardComponent,
       children: [
         { path: 'user', component: UserComponent },
         { path: 'role', component: RoleComponent} ,
         { path: '', redirectTo: 'role', pathMatch: 'full' },
       ]
     },
     
     { path: 'landlord', component: LandlordComponent},
     { path: 'property', component: PropertyComponent},
     { path: 'item', component: ItemComponent},
     { path: 'item-category', component: ItemCategoryComponent},
     { path: 'segment', component: SegmentComponent },       
     { path: 'tenant', component: TenantComponent },

     { path: 'complain', component: ComplainComponent},   
     { path: 'registration-technician', component: RegistrationTechnicianComponent},
     { path: 'technician-onboarding', component: TechnicianComponent},
     { path: 'technician-category', component: TechnicianCategoryComponent},
     { path: 'technician-approval', component: TechnicianApprovalComponent }, 
     { path: 'assign-technician', component: AssignTechnicianComponent },
     { path: 'assigned-technician-list', component: AssignedTechnicianListComponent },
     { path: 'edit-complain', component: EditComplainComponent},
     { path: 'landlord-dashboard', component: LandlordDashboardComponent },
     { path: 'tenant-dashboard', component: TenantDashboardComponent },
  
      // { path: 'agency', component: AgencyDashboardComponent, 
      //   children: [
      //     { path: 'detail/:agencyID', component: AgencyDashboardDialogComponent }
      //   ]
      // },       
 
    ]
    
  },
  
 { path: '**', component: NotFoundComponent },
];

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { LoginMatModule } from './login-mat/login-mat.module';
import { NotifyService } from '../services/notify-services/notify.service';
import { UserService } from '../services/user-services/user.service';
import { RoutesService } from '../services/routes-services/routes.service';



export function tokenGetter() { 
  return localStorage.getItem("jwt"); 
}

const loginModules = [
  CommonModule, 
  ReactiveFormsModule,
  RouterModule,
  RouterLink,


  //---------------------------------------------------  >>> Main
  JwtModule.forRoot({
    config:{
      tokenGetter: tokenGetter,
      allowedDomains: ["http://localhost:5000/api"],
      disallowedRoutes: []
    }

  }),
  LoginMatModule
  
  
]



@NgModule({
  declarations: [],
  imports: [
    loginModules,
  ],
  exports: [
    loginModules
  ],
  providers: [
    NotifyService,
    RoutesService,
    JwtHelperService
  ],
})
export class LoginModule { }

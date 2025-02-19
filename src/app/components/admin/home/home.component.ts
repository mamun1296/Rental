import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { RightsidebarComponent } from "../rightsidebar/rightsidebar.component";
import { LeftsidebarComponent } from "../leftsidebar/leftsidebar.component";
import { ChatboxComponent } from "../chatbox/chatbox.component";
import { HeaderComponent } from "../header/header.component";
import { Router } from 'express';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "../../login/login.component";
import { LogintestComponent } from "../../../logintest/logintest.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, RightsidebarComponent, LeftsidebarComponent,
    ChatboxComponent,
    HeaderComponent,
    RouterOutlet, LoginComponent, LogintestComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

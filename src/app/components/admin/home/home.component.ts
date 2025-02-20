import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { RightsidebarComponent } from "../rightsidebar/rightsidebar.component";
import { LeftsidebarComponent } from "../leftsidebar/leftsidebar.component";
import { ChatboxComponent } from "../chatbox/chatbox.component";
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { LogintestComponent } from "../../../logintest/logintest.component";




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent,
    RightsidebarComponent,
    LeftsidebarComponent,
    ChatboxComponent,
    HeaderComponent,
    RouterOutlet, LogintestComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

import { Component } from '@angular/core';
import { HomeComponent } from "./components/admin/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Rental_Service_Ui';
}

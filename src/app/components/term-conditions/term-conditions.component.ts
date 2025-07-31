import { Component, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { RouterLink } from '@angular/router';
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';
import { BookingCartService } from '../../services/booking-cart.service';

@Component({
  selector: 'app-term-conditions',
  standalone: true,
  imports: [RouterLink, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './term-conditions.component.html',
  styleUrl: './term-conditions.component.css'
})
export class TermConditionsComponent {
  sessionService : SessionService = inject(SessionService)
  bookCartService : BookingCartService = inject(BookingCartService)
  currentYear = new Date().getFullYear()

}

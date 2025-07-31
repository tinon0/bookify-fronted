import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../../services/donation.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-client-donate',
  standalone: true,
  imports: [RouterLink, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './client-donate.component.html',
  styleUrl: './client-donate.component.css'
})
export class ClientDonateComponent {

  bookCartService: BookingCartService = inject(BookingCartService)
  private donationService : DonationService = inject(DonationService)
  private sessionService : SessionService = inject(SessionService)
  currentYear = new Date().getFullYear()
  donationAmount: number = 1000;
  isInvalidDonation: boolean = false;

  proccesDonation() {
    if (this.donationAmount <= 0) {
      this.isInvalidDonation = true;
      return; // Evitar procesar si el monto no es válido
    }
    const idClient = this.sessionService.getIdClient
    this.donationService.donate(idClient, this.donationAmount).subscribe({
      next: (response) => {
        if (response.status) {
          window.location.href = response.data as any
        } else {
          console.error(response.message)
        }
      },
      error: (error) => console.error(error)
    })
  }

  validateDonation() {
    const regex = /^[0-9]{1,7}$/; // Permite solo 1 a 7 dígitos
  if (!regex.test(this.donationAmount.toString())) {
    this.isInvalidDonation = true;
  } else {
    this.isInvalidDonation = false;
  }

  // Verificar que no exceda el rango máximo o mínimo
  if (this.donationAmount > 1000000) {
    this.isInvalidDonation = true;
  }
  if (this.donationAmount <= 0) {
    this.isInvalidDonation = true
  }
  }
}


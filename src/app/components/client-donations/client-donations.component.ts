import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { Donation } from '../../models/donation';
import { DonationService } from '../../services/donation.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-client-donations',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './client-donations.component.html',
  styleUrl: './client-donations.component.css'
})
export class ClientDonationsComponent implements OnInit{
  currentYear = new Date().getFullYear()
  bookCartService : BookingCartService = inject(BookingCartService)
  private donationService : DonationService = inject(DonationService)
  private sessionService : SessionService = inject(SessionService)
  
  donations : Donation[] = []
  startDate: string = '';
  endDate: string = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;


  ngOnInit(): void {
    const idClient = Number(this.sessionService.getIdClient())
    this.donationService.getDonationByClientId(idClient).subscribe({
      next: (response) => {
        if (response.status) {
          this.donations = response.data as Donation[]
        } else {
          console.error(response.message);
        }
      },
      error: (error) => console.error(error)
    })
  }
  getFilteredDonations(): Donation[] {
    return this.donations.filter(donation => {
      const donationDate = new Date(donation.donation_date);

      return (
        (!this.startDate || donationDate >= new Date(this.startDate)) &&
        (!this.endDate || donationDate <= new Date(this.endDate)) &&
        (this.minAmount === null || donation.amount >= this.minAmount) &&
        (this.maxAmount === null || donation.amount <= this.maxAmount)
      );
    });
  }

  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.minAmount = null;
    this.maxAmount = null;
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";

@Component({
  selector: 'app-admin-donations',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-donations.component.html',
  styleUrl: './admin-donations.component.css'
})
export class AdminDonationsComponent implements OnInit{
  currentYear = new Date().getFullYear();
  private donationService : DonationService = inject(DonationService)
  private clientService : ClientService = inject(ClientService)
  donations : Donation[] = []
  startDate: Date | undefined;
  endDate: Date | undefined;
  minAmount: number | null = null;
  maxAmount: number | null = null;
  selectedClient : Client | undefined


  ngOnInit() : void {
    this.donationService.getDonations().subscribe({
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
  clearFilters() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.minAmount = null;
    this.maxAmount = null;
  }
  getFilteredDonations() {
    return this.donations.filter(donation => {
      const donationDate = new Date(donation.donation_date)

      return (
        (!this.startDate || donationDate >= new Date(this.startDate)) &&
        (!this.endDate || donationDate <= new Date(this.endDate)) &&
        (this.minAmount === null || donation.amount >= this.minAmount) &&
        (this.maxAmount === null || donation.amount <= this.maxAmount)
      )
    })
  }
  setSelectedClientId(idClient: number) {
    this.clientService.getClientById(idClient).subscribe(response => this.selectedClient = response.data as Client)
  }
}

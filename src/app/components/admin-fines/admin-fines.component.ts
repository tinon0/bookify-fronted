import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FineService } from '../../services/fine.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { Fine } from '../../models/fine';
import { ReservationService } from '../../services/reservation.service';
import { ReservationComplete } from '../../models/reservationComplete';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LoginComponent } from "../login/login.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";

@Component({
  selector: 'app-admin-fines',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-fines.component.html',
  styleUrl: './admin-fines.component.css'
})
export class AdminFinesComponent {
  currentYear = new Date().getFullYear();
  private fineService : FineService = inject(FineService)
  private reservationService : ReservationService = inject(ReservationService)
  private clientService : ClientService = inject(ClientService)
  fines : Fine[] = []
  startDate: Date | undefined;
  endDate: Date | undefined;
  minAmount: number | null = null;
  maxAmount: number | null = null;
  selectedClient : Client | undefined

  ngOnInit() : void {
    this.fineService.getFines().subscribe({
      next: (response) => {
        if (response.status) {
          this.fines = response.data as Fine[]
        } else {
          console.error(response.message)
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
    return this.fines.filter(fine => {
      const fineDate = new Date(fine.fine_date)

      return (
        (!this.startDate || fineDate >= new Date(this.startDate)) &&
        (!this.endDate || fineDate <= new Date(this.endDate)) &&
        (this.minAmount === null || fine.amount >= this.minAmount) &&
        (this.maxAmount === null || fine.amount <= this.maxAmount)
      )
    })
  }
  setSelectedClient(idReservation: number) {
    this.reservationService.getReservationById(idReservation).subscribe((r) => {
      const idClient = (r.data as ReservationComplete).reservation.id_client
      
      if (idClient) {
        this.clientService
          .getClientById(idClient)
          .subscribe((clientResponse) => {
          this.selectedClient = clientResponse.data as Client;
        })
      }
    })
  }
}

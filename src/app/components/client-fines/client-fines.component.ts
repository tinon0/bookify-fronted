import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { FineService } from '../../services/fine.service';
import { Fine } from '../../models/fine';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation.service';
import { ReservationComplete } from '../../models/reservationComplete';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-client-fines',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './client-fines.component.html',
  styleUrl: './client-fines.component.css',
})
export class ClientFinesComponent implements OnInit {
  currentYear = new Date().getFullYear();
  bookCartService: BookingCartService = inject(BookingCartService);
  private fineService: FineService = inject(FineService);
  private reservationService : ReservationService = inject(ReservationService)
  private sessionService : SessionService = inject(SessionService)

  fines: Fine[] = [];
  startDate: Date | undefined;
  endDate: Date | undefined;
  minAmount: number | null = null;
  maxAmount: number | null = null;
  selectedReservation : ReservationComplete | undefined

  ngOnInit(): void {
    this.fineService.getFineByClientId(this.sessionService.getIdClient()).subscribe({
      next: (response) => {
        if (response.status) {
          this.fines = response.data as Fine[];
        } else {
          console.error(response.message);
        }
      },
      error: (error) => console.error(error),
    });
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
  clearFilters() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.minAmount = null;
    this.maxAmount = null;
  }
  setSelectedReservation(idReservation : number) {
    this.reservationService.getReservations().subscribe(response => {
      const reservation = (response.data as ReservationComplete[]).find(r => r.reservation.id_reservation === idReservation)
      this.selectedReservation = reservation
    })
  }
}

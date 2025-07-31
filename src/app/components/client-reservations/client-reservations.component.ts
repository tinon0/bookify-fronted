import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { ReservationService } from '../../services/reservation.service';
import { ReservationComplete } from '../../models/reservationComplete';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationDetails } from '../../models/reservationDetails';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './client-reservations.component.html',
  styleUrl: './client-reservations.component.css'
})
export class ClientReservationsComponent implements OnInit{
  currentYear = new Date().getFullYear()
  bookCartService : BookingCartService = inject(BookingCartService)
  private reservationService : ReservationService = inject(ReservationService)
  private sessionService : SessionService = inject(SessionService)

  reservations : ReservationComplete[] = []
  searchText: string = '';
  filterPendiente: boolean = false;
  filterFinalizado: boolean = false;
  filterCancelado: boolean = false;
  filterPremium: boolean = false;
  filterNormal: boolean = false;
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedBooks: ReservationDetails[] = [];


  

  ngOnInit() : void {
    const idClient = this.sessionService.getIdClient()
    this.reservationService.getReservationsByIdClient(idClient).subscribe({
      next: (response) => {
        if (response.status) {
          this.reservations = response.data as ReservationComplete[]
          
        } else {
          console.error(response.message)
        }
      },
      error: (error) => console.error(error)
    })
  }

  getFilteredReservations(): ReservationComplete[] {
    return this.reservations.filter(res => {
        const reservationDate = new Date(res.reservation.reservation_date);

        return (
            (this.searchText === '' || res.reservation.id_reservation.toString().includes(this.searchText) ||
                res.reservation_details.some(detail => detail.book.title.toLowerCase().includes(this.searchText.toLowerCase())))
            && (!this.filterPendiente || res.reservation.status === 'PENDIENTE')
            && (!this.filterFinalizado || res.reservation.status === 'FINALIZADO')
            && (!this.filterCancelado || res.reservation.status === 'CANCELADO')
            && (!this.filterPremium || res.reservation.is_premium)
            && (!this.filterNormal || !res.reservation.is_premium)
            && (!this.startDate || reservationDate >= new Date(this.startDate))
            && (!this.endDate || reservationDate <= new Date(this.endDate))
        );
    });
}


  clearFilters() {
    this.filterPendiente = false;
    this.filterFinalizado = false;
    this.filterCancelado = false;
    this.filterPremium = false;
    this.filterNormal = false;
    this.startDate = undefined;
    this.endDate = undefined;
  }
  setSelectedBooks(bookDetails: ReservationDetails[]) {
    this.selectedBooks = bookDetails;
  }
}

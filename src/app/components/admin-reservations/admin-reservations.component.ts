import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { ReservationComplete } from '../../models/reservationComplete';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book';
import { ReservationDetails } from '../../models/reservationDetails';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";


@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-reservations.component.html',
  styleUrl: './admin-reservations.component.css'
})
export class AdminReservationsComponent implements OnInit {
  currentYear = new Date().getFullYear()
  private reservationService: ReservationService = inject(ReservationService)
  private clientService: ClientService = inject(ClientService)
  reservations: ReservationComplete[] = []

  filteredReservations: ReservationComplete[] = [];

  filterPendiente: boolean = false;
  filterFinalizado: boolean = false;
  filterCancelado: boolean = false;
  filterConfirmada: boolean = false;
  filterVencida: boolean = false;


  filterPremium: boolean = false;
  filterNormal: boolean = false;

  startDate: Date | null = null;
  endDate: Date | null = null;

  selectedBooks: Book[] = [];
  selectedClient: Client | null = null;

  ngOnInit(): void {
    this.reservationService.getReservations().subscribe({
      next: (response) => {
        if (response.status) {
          this.reservations = response.data as ReservationComplete[]
        } else {
          console.error(response.message);
        }
      },
      error: (error) => console.error(error)
    })
  }

  getFilteredReservations(): ReservationComplete[] {
    return this.reservations.filter(res => {
      let matchEstado = this.filterPendiente && res.reservation.status === 'PENDIENTE'
        || this.filterFinalizado && res.reservation.status === 'FINALIZADA'
        || this.filterCancelado && res.reservation.status === 'CANCELADA'
        || this.filterConfirmada && res.reservation.status === 'CONFIRMADA'
        || this.filterVencida && res.reservation.status === 'VENCIDA'
        || (!this.filterPendiente && !this.filterFinalizado && !this.filterCancelado && !this.filterConfirmada && !this.filterVencida);

      let matchTipo = this.filterPremium && res.reservation.is_premium
        || this.filterNormal && !res.reservation.is_premium
        || (!this.filterPremium && !this.filterNormal);

      let matchFecha = true;
      if (this.startDate && this.endDate) {
        const resDate = new Date(res.reservation.reservation_date);
        matchFecha = resDate >= this.startDate && resDate <= this.endDate;
      }

      return matchEstado && matchTipo && matchFecha;
    });
  }

  clearFilters(): void {
    this.filterPendiente = false;
    this.filterFinalizado = false;
    this.filterCancelado = false;
    this.filterPremium = false;
    this.filterNormal = false;
    this.startDate = null;
    this.endDate = null;
    this.filteredReservations = [...this.reservations];
  }

  setSelectedBooks(bookDetails: ReservationDetails[]): void {
    this.selectedBooks = []
    bookDetails.forEach(detail => this.selectedBooks.push(detail.book))    
  }

  setSelectedClient(idClient: any): void {
    this.clientService.getClientById(idClient).subscribe(response => this.selectedClient = response.data as Client)
  }

  deleteReservation(reservationId: any): void {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: (response) => {
        if (response.status) {
          const reservation = this.reservations.find(res => res.reservation.id_reservation === reservationId);
          if (reservation) {
            reservation.reservation.status = 'CANCELADA';
          }
          Swal.fire({
            icon: "success",
            title: "Reserva Eliminada",
            text: "Presiona OK para continuar",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload()
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al Eliminar Reserva",
            text: response.message,
          });
          console.error(response.message);
        }
      },
      error: (error) => console.error(error)
    })
  }

  getAvailableStatuses(currentStatus: string): string[] {
    switch (currentStatus) {
      case 'PENDIENTE':
        return ['CONFIRMADA', 'FINALIZADA'];
      case 'CONFIRMADA':
        return ['FINALIZADA'];
      case 'FINALIZADA':
        return []; // No permitir cambios si ya está finalizada
      default:
        return [];
    }
  }


  changeStatus(reservationId: any, newStatus: string): void {
    this.reservationService.changeReservationStatus(reservationId, newStatus).subscribe({
      next: (response) => {
        if (response.status) {
          const reservation = this.reservations.find(res => res.reservation.id_reservation === reservationId);
          if (reservation) {
            reservation.reservation.status = newStatus;
          }
          Swal.fire({
          icon: "success",
          title: `Estado Cambiado a: ${newStatus}`,
          text: "Presiona OK para continuar",
          confirmButtonText: "OK",
        })
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al cambiar estado",
            text: response.message,
          });
          console.error(`Error al cambiar estado: ${response.message}`);
        }
      },
      error: (error) => console.error(`Error en la solicitud: ${error.message}`)
    });
  }

}

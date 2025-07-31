import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { Reservation } from '../../models/reservation';
import { Client } from '../../models/client';
import { ReservationService } from '../../services/reservation.service';
import { ClientService } from '../../services/client.service';
import { ReservationComplete } from '../../models/reservationComplete';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-payments.component.html',
  styleUrl: './admin-payments.component.css',
})
export class AdminPaymentsComponent implements OnInit {
  currentYear = new Date().getFullYear();
  private paymentService: PaymentService = inject(PaymentService);
  private reservationService: ReservationService = inject(ReservationService);
  private clientService: ClientService = inject(ClientService);
  payments: Payment[] = [];
  startDate: string = '';
  endDate: string = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  selectedReservation: Reservation | null = null;
  selectedClient: Client | null = null;
  // showModal: boolean = false;

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe({
      next: (response) => {
        if (response.status) {
          this.payments = response.data as Payment[];
        } else {
          console.error(response.message);
        }
      },
      error: (error) => console.error(error),
    });
  }

  getFilteredDonations(): Payment[] {
    const filtrado: Payment[] = this.payments.filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      return (
        (!this.startDate || paymentDate >= new Date(this.startDate)) &&
        (!this.endDate || paymentDate <= new Date(this.endDate)) &&
        (this.minAmount === null || payment.amount >= this.minAmount) &&
        (this.maxAmount === null || payment.amount <= this.maxAmount)
      );
    });
    return filtrado;
  }

  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.minAmount = null;
    this.maxAmount = null;
  }

  openDetails(idReservation: number) {
    this.reservationService.getReservationById(idReservation).subscribe((r) => {
      const reservationComplete = r.data as ReservationComplete
      this.selectedReservation = reservationComplete.reservation

      if (this.selectedReservation) {
        this.clientService
          .getClientById(this.selectedReservation.id_client)
          .subscribe((clientResponse) => {
            this.selectedClient = clientResponse.data as Client;
          });
      }
    });
  }
}

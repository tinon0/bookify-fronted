import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { forkJoin } from 'rxjs';
import { Client } from '../../models/client';
import { ReservationData } from '../../models/reservationData';
import { Payment } from '../../models/payment';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Chart, registerables } from 'chart.js';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentYear = new Date().getFullYear()
  private dashboardService: DashboardService = inject(DashboardService)
  selectedOptionModal : string = ""
  filteredResults: any[] = []
  filteredModalOpen : boolean = false


  //valores

  //donations
  totalDonation: number = 0
  avgDonation: number = 0
  // donationsByClient: number = 0
  clientMostDonationsByCount: Client | undefined
  clientMostDonationsByAmount: Client | undefined

  //reservations
  totalReservations: number = 0
  reservationsByStatus: ReservationData | undefined
  reservationsByPremiumStatus: ReservationData | undefined
  avgReservationsPerClient: number = 0
  canceledReservations: number = 0

  //payments
  totalAmountPaid: number = 0
  totalPayments: number = 0
  recentPayments: Payment[] = []

  //books
  reservedBooks: number = 0

  //fines
  totalFineAmount: number = 0
  totalFines: number = 0
  avgFineAmount: number = 0
  finesLastMonth: number = 0

  // Flags de carga
  isLoading = {
    totalDonation: true,
    avgDonation: true,
    clientMostDonationsByCount: true,
    clientMostDonationsByAmount: true,
    totalReservations: true,
    reservationsByStatus: true,
    reservationsByPremiumStatus: true,
    avgReservationsPerClient: true,
    canceledReservations: true,
    totalAmountPaid: true,
    totalPayments: true,
    recentPayments: true,
    reservedBooks: true,
    totalFineAmount: true,
    totalFines: true,
    avgFineAmount: true,
    finesLastMonth: true,
  };



  ngOnInit(): void {
    Chart.register(...registerables);
    forkJoin({
      totalDonation: this.dashboardService.findTotalDonationAmount(),
      avgDonation: this.dashboardService.findAverageDonationAmount(),
      clientMostDonationsByCount: this.dashboardService.findClientWithMostDonationsByCount(),
      clientMostDonationsByAmount: this.dashboardService.findClientWithMostDonationsByAmount(),
      totalReservations: this.dashboardService.countTotalReservations(),
      reservationsByStatus: this.dashboardService.countReservationsByStatus(),
      reservationsByPremiumStatus: this.dashboardService.countReservationsByPremiumStatus(),
      avgReservationsPerClient: this.dashboardService.findAverageReservationsPerClient(),
      canceledReservations: this.dashboardService.countCanceledReservations(),
      totalAmountPaid: this.dashboardService.getTotalAmountPaid(),
      totalPayments: this.dashboardService.countPayments(),
      recentPayments: this.dashboardService.getRecentPayments(new Date()), 
      reservedBooks: this.dashboardService.countReservedBooks(),
      totalFineAmount: this.dashboardService.findTotalFineAmount(),
      totalFines: this.dashboardService.countTotalFines(),
      avgFineAmount: this.dashboardService.findAverageFineAmount(),
      finesLastMonth: this.dashboardService.countFinesLastMonth(),
    }).subscribe({
      next: (response) => {

        const allResponsesValid = Object.values(response).every(response => response.status === true);

        if (allResponsesValid) {

          // Asignar las respuestas a las variables correspondientes

          this.totalDonation = Number(response.totalDonation.data);
          this.isLoading.totalDonation = false;

          this.avgDonation = Number(response.avgDonation.data);
          this.isLoading.avgDonation = false;
          this.clientMostDonationsByCount = response.clientMostDonationsByCount ? (response.clientMostDonationsByCount.data as Client) : undefined;
          this.isLoading.clientMostDonationsByCount = false;
          this.clientMostDonationsByAmount = response.clientMostDonationsByAmount ? (response.clientMostDonationsByAmount.data as Client) : undefined;
          this.isLoading.clientMostDonationsByAmount = false;

          this.totalReservations = Number(response.totalReservations.data);
          this.isLoading.totalReservations = false;
          this.reservationsByStatus = response.reservationsByStatus ? (response.reservationsByStatus.data as ReservationData) : undefined;
          this.reservationsByPremiumStatus = response.reservationsByPremiumStatus ? (response.reservationsByPremiumStatus.data as ReservationData) : undefined;
          this.avgReservationsPerClient = Number(response.avgReservationsPerClient.data);
          this.isLoading.avgReservationsPerClient = false;
          this.canceledReservations = Number(response.canceledReservations.data);
          this.isLoading.canceledReservations = false;

          this.totalAmountPaid = Number(response.totalAmountPaid.data);
          this.isLoading.totalAmountPaid = false;
          this.totalPayments = Number(response.totalPayments.data);
          this.isLoading.totalPayments = false;
          this.recentPayments = response.recentPayments ? (response.recentPayments.data as Payment[]) : [];
          this.isLoading.recentPayments = false;
          this.reservedBooks = Number(response.reservedBooks.data);
          this.isLoading.reservedBooks = false;
          this.totalFineAmount = Number(response.totalFineAmount.data);
          this.isLoading.totalFineAmount = false;
          this.totalFines = Number(response.totalFines.data);
          this.isLoading.totalFines = false;
          this.avgFineAmount = Number(response.avgFineAmount.data);
          this.isLoading.avgFineAmount = false;
          this.finesLastMonth = Number(response.finesLastMonth.data);
          this.isLoading.finesLastMonth = false;

          this.createPieChart('reservationsByStatusChart', response.reservationsByStatus.data, "reservationsByStatus");
          this.isLoading.reservationsByStatus = false;
          this.createPieChart('reservationsByTypeChart', response.reservationsByPremiumStatus.data, "reservationsByPremiumStatus");
          this.isLoading.reservationsByPremiumStatus = false;


          
        } else {

          console.error('Error en las apis');
        }
      },
      error: (err) => {
        console.error(err);
        console.log(err);
      }
    });
  }

  createPieChart(chartId: string, data: any, option: string) {
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;

    const labels = Object.keys(data).map(key => 
    option === "reservationsByPremiumStatus"
      ? key === "premium" ? "Premium" : key === "no_premium" ? "Normal" : key
      : key
    );
    const colorMap: { [key: string]: string } = {
        "PENDIENTE": "#198754",  // bg-success
        "CONFIRMADA": "#0D6EFD", // bg-primary
        "FINALIZADA": "#6C757D", // bg-secondary
        "CANCELADA": "#DC3545",  // bg-danger
        "VENCIDA": "#FFC107"     // bg-warning
    };
    const datasetColors = option === "reservationsByPremiumStatus"
        ? [ "#FFC107", "#0DCAF0" ] // Colores específicos para Premium/Normal
        : labels.map(label => colorMap[label] || "#000000");

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: Object.values(data),
          backgroundColor: datasetColors,
        }]
      }
    });
  }

//   reservationEntries(option: string): { key: string, value: number }[] {
//     if (option === "reservationsByStatus") {
//         return this.reservationsByStatus
//             ? Object.entries(this.reservationsByStatus).map(([key, value]) => ({ key, value }))
//             : [];
//     }
//     if (option === "reservationsByPremiumStatus") {
//         return this.reservationsByPremiumStatus
//             ? Object.entries(this.reservationsByPremiumStatus).map(([key, value]) => ({
//                 key: key === "premium" ? "Premium" : key === "no_premium" ? "Normal" : key, 
//                 value
//             }))
//             : [];
//     }
//     return [];
// }


}

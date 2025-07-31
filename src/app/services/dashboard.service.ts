import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseBase } from '../models/responseBase';
import { SessionService } from './session.service';
import { BetweenDates } from '../models/betweenDates';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)


  //DONATIONS
  findTotalDonationAmount() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/donation/findTotalDonationAmount", {headers})
  }
  findAverageDonationAmount() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/donation/findAverageDonationAmount", {headers})
  }
  countDonationsByClient(idClient : number) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>(`http://localhost:8080/dashboard/donation/countDonationsByClient?idClient=${idClient}`, {headers})
  }
  findDonationsByDonationDateBetween(dates : BetweenDates) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>(`http://localhost:8080/dashboard/donation/findDonationsByDonationDateBetween`, dates, {headers})
  }
  findClientWithMostDonationsByCount() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/donation/findClientWithMostDonationsByCount", {headers})
  }
  findClientWithMostDonationsByAmount() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/donation/findClientWithMostDonationsByAmount", {headers})
  }


  //RESERVATIONS
  countTotalReservations() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/reservation/countTotalReservations", {headers})
  }
  countReservationsByStatus() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/reservation/countReservationsByStatus", {headers})
  }
  countReservationsByPremiumStatus() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/reservation/countReservationsByPremiumStatus", {headers})
  }
  countReservatinosByClient(idClient : number) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>(`http://localhost:8080/dashboard/reservation/countReservationsByClient?idClient=${idClient}`, {headers})
  }
  findAverageReservationsPerClient() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/reservation/findAverageReservationsPerClient", {headers})
  }
  findReservationsByReservationDateBetween(dates : BetweenDates) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>(`/dashboard/reservation/findReservationsByReservationDateBetween`, dates, {headers})
  }
  countCanceledReservations() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/reservation/countCanceledReservations", {headers})
  }

  //PAYMENTS
  findAllByPaymentDateBetween(dates : BetweenDates) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>(`http://localhost:8080/dashboard/payment/findAllByPaymentDateBetween`, dates, {headers})
  }
  getRecentPayments(date : Date) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>(`http://localhost:8080/dashboard/payment/getRecentPayments`, date, {headers})
  }
  countPayments() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/payment/countPayments", {headers})
  }
  getTotalAmountPaid() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/payment/getTotalAmountPaid", {headers})
  }

  //BOOKS
  countReservedBooks() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/book/countReservedBooks", {headers})
  }

  //FINES
  findTotalFineAmount() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/fine/findTotalFineAmount", {headers})
  }
  countTotalFines() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/fine/countTotalFines", {headers})
  }
  findAverageFineAmount() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/fine/findAverageFineAmount", {headers})
  }
  countFinesLastMonth() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/dashboard/fine/countFinesLastMonth", {headers})
  }
}

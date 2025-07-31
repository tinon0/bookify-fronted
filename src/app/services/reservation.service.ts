import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ResponseBase } from '../models/responseBase';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)


  makeReservation(id_books : number[]) {
    const id_client = this.sessionService.getIdClient()
    const data = {
      id_client,
      id_books
    }
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
        });
    return this.http.post<ResponseBase>("http://localhost:8080/reservation", data, { headers })
  }
  getReservationsByIdClient(idClient : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/reservation/" + idClient, { headers })
  }
  getReservations() {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/reservation", { headers } )
  }
  getReservationById(idReservation : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>(`http://localhost:8080/reservation/id/${idReservation}`, { headers } )
  }
  deleteReservation(idReservation : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.delete<ResponseBase>(`http://localhost:8080/reservation?idReservation=${idReservation}`, { headers } )
  }
  changeReservationStatus(idReservation : any, newStatus : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.patch<ResponseBase>(`http://localhost:8080/reservation/change/${idReservation}?newStatus=${newStatus}`, {} ,{ headers } )
  }
}

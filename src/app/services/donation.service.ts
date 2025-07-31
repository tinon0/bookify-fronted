import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ResponseBase } from '../models/responseBase';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)

  donate(idClient : any, donationAmount: any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`,
          'Accept': '*/*'
    });
    return this.http.post<ResponseBase>(`http://localhost:8080/mercadopago/donate?donation=${donationAmount}&idClient=${idClient}`, {} ,{ headers })
  }
  getDonations() {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/donation", {headers})
  }
  getDonationByClientId(idClient : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>(`http://localhost:8080/donation/${idClient}`, {headers})
  }
}

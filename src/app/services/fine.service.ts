import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ResponseBase } from '../models/responseBase';

@Injectable({
  providedIn: 'root'
})
export class FineService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)

  getFines() {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/fine", { headers } )
  }
  getFineByClientId(idClient : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>(`http://localhost:8080/fine/${idClient}`, { headers } )
  }

}

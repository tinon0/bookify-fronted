import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ResponseBase } from '../models/responseBase';
import { SendEmail } from '../models/sendEmail';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)
  
  getBody() {
    return this.http.get('notification.html', { responseType: 'text'})
  }
  sendEmail(data : SendEmail) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.post<ResponseBase>("http://localhost:8080/mail/send", data, { headers })
  }
}

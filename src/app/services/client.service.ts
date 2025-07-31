import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseBase } from '../models/responseBase';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)

  createUser(data : any) {
    return this.http.post<ResponseBase>("http://localhost:8080/client", data)
  }

  getClients() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/client", { headers })
  }

  getClientById(client_id : number) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>(`http://localhost:8080/client/${client_id}`, {headers})
  }

  updateClient(queryString : string) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`,
      'Accept': '*/*'
    });

    return this.http.put<ResponseBase>(`http://localhost:8080/client?${queryString}`, null, {headers})
  }
  getClientsContacts() {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.get<ResponseBase>("http://localhost:8080/client/contacts",  { headers })
  }
  changeStatus(idClient : any, newStatus : any) {
    const headers = new HttpHeaders({
      'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.patch<ResponseBase>(`http://localhost:8080/client/change/${idClient}?newStatus=${newStatus}`, {} ,{headers})
  }
}

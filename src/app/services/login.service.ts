import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginData } from '../models/loginRequest';
import { LoginResponse } from '../models/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http : HttpClient = inject(HttpClient)

  login(loginRequest : LoginData) {
    return this.http.post<LoginResponse>("http://localhost:8080/login", loginRequest)
  }
  
  encodeBasicAuth(email: string, password: string) {
    const credentials = `${email}:${password}`;
    return "Basic " + btoa(credentials); 
  }
}

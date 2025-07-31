import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { LoginData } from '../../models/loginRequest';
import { LoginResponse } from '../../models/loginResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private loginService : LoginService = inject(LoginService)
  private sessionService : SessionService = inject(SessionService)
  private router : Router = inject(Router)

  email : string = ""
  password : string = ""

  error : boolean = false
  errorMessage : string = ""

  submit() {
    const data : LoginData = {
      email: this.email,
      password: this.password
    }

    this.loginService.login(data).subscribe({
      next: (response : LoginResponse) => {

        this.cleanErrors()

        this.sessionService.setIdClient(response.client_id)
        this.sessionService.set("userRole", response.role)
        this.sessionService.set("authHeader", this.loginService.encodeBasicAuth(this.email, this.password))
        
        this.cleanLogin()
        if (response.role === "ADMIN") {
          this.router.navigate(['/dashboard'])
        } else {
          this.router.navigate(['/principal'])
        }
      },
      error: (errorResponse) => {
        console.error("Error en la solicitud:", errorResponse);

        this.cleanLogin()
        if (errorResponse.error) {
          this.errorMessage = errorResponse.error || "Ha ocurrido un error inesperado.";
        } else {
          this.errorMessage = "Error desconocido.";
        }
        this.error = true;
      }
    })
  }
  createUser() {
    this.router.navigate(['/createUser'])
  }
  cleanErrors() {
    this.error = false
    this.errorMessage = ""
  }
  cleanLogin() {
    this.email = ""
    this.password = ""
  }
}

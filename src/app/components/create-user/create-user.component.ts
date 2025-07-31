import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { SessionService } from '../../services/session.service';
import { Client } from '../../models/client';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {

  private clientService: ClientService = inject(ClientService)
  private sessionService: SessionService = inject(SessionService)
  private loginService: LoginService = inject(LoginService)
  private router: Router = inject(Router)

  form = new FormGroup({
    mail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    telephone: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{10}')]),
    address: new FormControl('', [Validators.required])
  })

  isLoading: boolean = false


  submit() {
    if (this.form.valid) {
      const data = this.form.value
      const clientMail = data.mail as string
      const clientPass = data.password as string

      this.isLoading = true

      this.clientService.createUser(data).subscribe({
        next: (response) => {
          this.isLoading = false

          if (response.status) {
            const client = response.data as Client

            Swal.fire("Bienvenido!")
            this.form.reset()

            this.sessionService.setIdClient(client.id_client.toString())
            this.sessionService.set("userRole", "CLIENT")
            this.sessionService.set("authHeader", this.loginService.encodeBasicAuth(clientMail, clientPass))

            this.router.navigate(['/principal'])
          } else {
            Swal.fire({
              icon: "error",
              title: "Hubo un error",
              text: response.message,
              confirmButtonText: "OK",
              timer: 2000
            });
          }

        },
        error: (error) => {
          this.isLoading = false

          console.error(error)
          console.log(error);
        }
      })
    }
  }

}

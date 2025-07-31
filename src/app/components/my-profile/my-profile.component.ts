import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingCartService } from '../../services/booking-cart.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

  private clientService: ClientService = inject(ClientService)
  bookCartService : BookingCartService = inject(BookingCartService)
  sessionService : SessionService = inject(SessionService)

  currentYear: number = new Date().getFullYear();
  client: Client | undefined
  client_id: number = Number(this.sessionService.getIdClient())
  isEditing: boolean = false
  copyFormData: any;

  updateClient = new FormGroup({
    idClient: new FormControl(),
    new_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    new_surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    new_telephone: new FormControl(0, [Validators.required, Validators.pattern('[0-9]{10}')]),
    new_address: new FormControl('', [Validators.required])
  })


  ngOnInit(): void {
    this.clientService.getClientById(this.client_id).subscribe({
      next: (response) => {
        if (response.status) {
          this.client = response.data as Client

          const initialValues = {
            idClient: this.client.id_client,
            new_name: this.client.name,
            new_surname: this.client.surname,
            new_telephone: this.client.telephone,
            new_address: this.client.address
          }

          this.updateClient.setValue(initialValues)
          this.copyFormData = { ...initialValues }

        } else {
          console.log(response.message);
          console.error(response.message);
        }
      },
      error: (error) => {
        console.log(error);
        console.error(error);
      }
    })
  }

  editProfile(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.updateClient.setValue(this.copyFormData)
  }

  saveChanges(): void {
    const originalClient = { ...this.client };
    const updatedFields: any = {};

    if (this.updateClient.value.new_name !== originalClient.name) {
      updatedFields.new_name = this.updateClient.value.new_name; 
    }
    if (this.updateClient.value.new_surname !== originalClient.surname) {
      updatedFields.new_surname = this.updateClient.value.new_surname;
    }
    if (this.updateClient.value.new_telephone !== originalClient.telephone) {
      updatedFields.new_telephone = this.updateClient.value.new_telephone;
    }
    if (this.updateClient.value.new_address !== originalClient.address) {
      updatedFields.new_address = this.updateClient.value.new_address;
    }

    if (Object.keys(updatedFields).length > 0) {
      const idClient = originalClient.id_client ? originalClient.id_client.toString() : "";
      const queryString = new URLSearchParams({ idClient, ...updatedFields }).toString();

      this.update(queryString);
    }
  }


  update(url: string) {
    this.clientService.updateClient(url).subscribe({
      next: (response) => {
        if (response.status) {

          Swal.fire({
          icon: "success",
          title: "Perfil Modificado!",
          text: "Presiona OK para continuar",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Solo recarga cuando el usuario confirma
          }
        });
          window.location.reload()
        } else {
          console.error(response.message);
          console.log(response.message);
        }
      },
      error: (error) => {
        console.error(error);
        console.log(error);
      }
    })
  }
}

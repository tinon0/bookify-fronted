import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";


@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-clients.component.html',
  styleUrl: './admin-clients.component.css'
})
export class AdminClientsComponent implements OnInit {

  currentYear = new Date().getFullYear()
  private clientService: ClientService = inject(ClientService)
  clients: Client[] = []
  searchText: string = ''
  filterActivo: boolean = false
  filterInactivo: boolean = false
  filterMoroso: boolean = false

  ngOnInit(): void {
    this.clientService.getClients().subscribe({
      next: (response) => {
        if (response.status) {
          this.clients = response.data as Client[]
        }
      },
      error: (error) => console.error(error)
    })
  }

  clearFilters() {
    this.filterActivo = false
    this.filterInactivo = false
    this.filterMoroso = false
  }

  getFilteredClients(): Client[] {
    return this.clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        client.surname.toLowerCase().includes(this.searchText.toLowerCase()) ||
        client.telephone.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
        client.address.toLowerCase().toLowerCase().includes(this.searchText.toLowerCase())

      const matchStatus = (!this.filterActivo && !this.filterInactivo && !this.filterMoroso) ||
        (this.filterActivo && client.status === 'ACTIVO') ||
        (this.filterInactivo && client.status === 'INACTIVO') ||
        (this.filterMoroso && client.status === 'MOROSO')
      return matchStatus && matchesSearch
    })
  }
  changeStatus(idClient: number, newStatus: string) {
    this.clientService.changeStatus(idClient, newStatus).subscribe({
      next: (response) => {
        if (response.status) {
          const client = this.clients.find(client => client.id_client === idClient);
          if (client) {
            client.status = newStatus;
          }

          Swal.fire({
            icon: "success",
            title: `Estado Cambiado a: ${newStatus}!`,
            confirmButtonText: "OK",
          });

        } else {
          Swal.fire({
            icon: "error",
            title: "Error al cambiar estado",
            text: response.message,
          });
        }
      },

      error: (error) => console.error(`Error en la solicitud: ${error.message}`)
    })
  }
}

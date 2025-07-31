import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientContact } from '../../models/clientContact';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { SendEmail } from '../../models/sendEmail';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-notifications.component.html',
  styleUrl: './admin-notifications.component.css'
})
export class AdminNotificationsComponent implements OnInit {

  private clientService: ClientService = inject(ClientService)
  private emailService: EmailService = inject(EmailService)

  currentYear = new Date().getFullYear()
  clientContacts: ClientContact[] = []
  selectedContacts: ClientContact[] = [];
  searchQuery: string = '';
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';

  loading: boolean = false;

  ngOnInit(): void {
    this.clientService.getClientsContacts().subscribe({
      next: (response) => {
        if (response.status) {
          this.clientContacts = response.data as ClientContact[]
        } else {
          console.error(response.message);
        }
      },
      error: (error) => console.error(error)
    })
  }
  toggleSelect(contact: ClientContact) {
    if (this.selectedContacts.includes(contact)) {
      this.selectedContacts = this.selectedContacts.filter(c => c !== contact);
    } else {
      this.selectedContacts.push(contact);
    }
  }
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedContacts = checked ? [...this.clientContacts] : [];
  }
  updateSearch() {
    return this.clientContacts.filter(client => {
      const matchesSearch =
        client.name.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()) ||
        client.surname.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()) ||
        client.mail.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
      return matchesSearch
    })
  }
  openNotificationModal(type: string) {
    this.notificationType = type;
  }

  sendNotification() {
    this.loading = true;

    this.emailService.getBody().subscribe({
      next: (response) => {
        let bodyTemplate = response;

        const requests = this.selectedContacts.map(contact => {
          const data: SendEmail = {
            mailToSend: contact.mail,
            subject: this.notificationTitle,
            body: bodyTemplate.replace('{{mensaje}}', this.notificationMessage)
          };

          return this.emailService.sendEmail(data).toPromise();
        });

        Promise.all(requests)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Notificación Enviada Correctamente!",
              confirmButtonText: "OK",
            })
              .then((result) => {
                if (result.isConfirmed) {
                  window.location.reload(); // Solo recarga cuando el usuario confirma
                }
              });
          })
          .catch(error => {
            Swal.fire({
              icon: "error",
              title: "Se produjo un error",
              confirmButtonText: "OK",
            });
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
            this.notificationTitle = '';
            this.notificationMessage = '';
            this.selectedContacts = [];
          });
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

}

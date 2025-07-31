import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { ReservationService } from '../../services/reservation.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";

@Component({
  selector: 'app-booking-cart',
  standalone: true,
  imports: [RouterLink, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './booking-cart.component.html',
  styleUrl: './booking-cart.component.css'
})
export class BookingCartComponent implements OnInit {

  currentYear = new Date().getFullYear()
  private bookCartService: BookingCartService = inject(BookingCartService)
  private bookService: BookService = inject(BookService)
  private reservationService: ReservationService = inject(ReservationService)
  private router : Router = inject(Router)
  bookToReserve: Book[] = []
  isLoading: boolean = false;


  hasPremiumBooks(): boolean {
    return this.bookToReserve.some(book => book.is_premium);
  }

  ngOnInit(): void {
    this.bookCartService.getBookIds().forEach(idBook => {
      this.bookService.getBookById(idBook).subscribe({
        next: (response) => this.bookToReserve.push(response.data as Book),
        error: (error) => console.error(error)
      })
    })
  }

  removeBook(bookId: number) {
    this.bookToReserve = this.bookToReserve.filter(book => book.id_book !== bookId);
    this.bookCartService.removeBookId(bookId);
  }

  reserveBooks() {
    this.isLoading = true
    this.reservationService.makeReservation(this.bookCartService.getBookIds()).subscribe({
      next: (response) => {
        if (response.status) {
          this.isLoading = false
          if (this.hasPremiumBooks()) {
            window.location.href = (response.data as any)["Payment Link"]
          } else {
            Swal.fire({
              icon: "success",
              title: "Su Reserva ha sido creada correctamente!",
              confirmButtonText: "OK"
            }).then((result) => {
              if (result.isConfirmed) {
                this.bookCartService.emptyCart()
                this.router.navigate(['/principal'])
              }
            })
          }
        } else {
          Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: response.message,
          showConfirmButton: false,
          timer: 2000
        });

          console.error(response.message);
          console.log(response.message);
        }
      },
      error: (error) => {
        this.isLoading = false
        console.error(error);
        console.log(error);
      }
    })
  }


}

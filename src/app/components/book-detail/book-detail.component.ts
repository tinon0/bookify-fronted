import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { BookingCartService } from '../../services/booking-cart.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute)
  private bookService: BookService = inject(BookService)
  bookCartService: BookingCartService = inject(BookingCartService)
  sessionService : SessionService = inject(SessionService)


  currentYear = new Date().getFullYear()
  bookId: number = 0
  book: Book | undefined

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
    });
    this.bookService.getBookById(this.bookId).subscribe({
      next: (response) => {
        if (response.status) {
          this.book = response.data as Book
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


  addBookToCart() {
    const idBook = this.book?.id_book ?? 0;
    if (idBook === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el libro",
        showConfirmButton: true,
        timer: 2000
      });
      return;
    }

    this.bookCartService.addBookId(idBook);
    Swal.fire({
      icon: "success",
      title: "Libro Agregado a tu Reserva!",
      confirmButtonText: "OK",
      timer: 2000
    });
  }

}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingCartService } from '../../services/booking-cart.service';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-client-view-books',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './client-view-books.component.html',
  styleUrl: './client-view-books.component.css'
})
export class ClientViewBooksComponent implements OnInit{
  currentYear = new Date().getFullYear();
  bookCartService: BookingCartService = inject(BookingCartService)
  searchText: string = "";
  filterPremium: boolean = false;
  filterNormal: boolean = false;
  private bookService : BookService = inject(BookService)
  books : Book[] = []

  private sessionService : SessionService = inject(SessionService)
  private router : Router = inject(Router)


  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (response) => {
        if (response.status) {
          this.books = (response.data as Book[]).filter(book => book.status !== "ELIMINADO")
        } else {
          console.error(response.message);
        }
      },
      error: (error) => console.error(error)
    })
  }
  
  getFilteredBooks() {
    return this.books.filter(book => {
      // Filtro de texto
      const matchesSearch = book.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.genre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.editorial.toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.publication_year.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
        book.isbn.toLowerCase().includes(this.searchText.toLowerCase());

      // Filtro de tipo (Premium/Normal)
      const matchesType = (!this.filterPremium && !this.filterNormal) ||
        (this.filterPremium && book.is_premium) ||
        (this.filterNormal && !book.is_premium);

      return matchesSearch && matchesType
    });
  }


  clearFilters() {
    this.filterPremium = false;
    this.filterNormal = false;
  }

  addBookToCart(id: number) {
    if (this.sessionService.get("userRole") === null) {
      this.router.navigate(['/login'])
    } else {
      this.bookCartService.addBookId(id)
    }
  }
}

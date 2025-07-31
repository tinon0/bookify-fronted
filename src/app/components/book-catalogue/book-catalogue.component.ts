import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { BookingCartService } from '../../services/booking-cart.service';
import { debounceTime, Subject } from 'rxjs';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-book-catalogue',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './book-catalogue.component.html',
  styleUrl: './book-catalogue.component.css'
})
export class BookCatalogueComponent implements OnInit, AfterViewInit {

  private bookService: BookService = inject(BookService)
  sessionService: SessionService = inject(SessionService)
  bookCartService: BookingCartService = inject(BookingCartService)
  private router : Router = inject(Router)

  currentYear: number = new Date().getFullYear();

  bookList: Book[] = []
  normalBooks: Book[] = []
  premiumBooks: Book[] = []


  scrollPosition = 0;
  cardWidth = 280;

  searchResults: Book[] = [];
  searchNoResults = false;
  searchTerm$ = new Subject<string>();


  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (response) => {
        if (response.status) {
          this.bookList = response.data as Book[]

          this.premiumBooks = this.bookList
            .filter(book => book.is_premium && book.status === 'LIBRE') // Filtra solo los premium que estén LIBRE
            .slice(0, 10); // Toma los primeros 10 premium

          this.normalBooks = this.bookList
            .filter(book => !book.is_premium && book.status === 'LIBRE') // Filtra solo los normales que estén LIBRE
            .slice(0, 10); // Toma los primeros 10 normales


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


  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @ViewChild('sliderPremiumContainer') sliderPremiumContainer!: ElementRef;


  ngAfterViewInit(): void {
    if (this.sliderContainer) {
      this.inicializarSliderNormal();
    }
    if (this.sliderPremiumContainer) {
      this.inicializarSliderPremium()
    }
  }

  inicializarSliderNormal() {
    const containerElement = this.sliderContainer.nativeElement;
    containerElement.style.scrollBehavior = 'smooth';
  }

  inicializarSliderPremium() {
    const containerElementPremium = this.sliderPremiumContainer.nativeElement;
    containerElementPremium.style.scrollBehavior = 'smooth';

  }

  scrollBooks(direction: 'prev' | 'next'): void {


    const container = this.sliderContainer.nativeElement.querySelector('.slider-wrapper');

    // Cantidad de tarjetas visibles en el contenedor
    const numVisible = Math.floor(container.offsetWidth / this.cardWidth);

    // Máximo desplazamiento posible
    const maxScroll = container.scrollWidth - container.offsetWidth;

    if (direction === 'next') {
      // Incrementar la posición de desplazamiento
      this.scrollPosition += this.cardWidth * numVisible;

      // Si llegamos al final, ir al principio
      if (this.scrollPosition > maxScroll) {
        // Reiniciar la posición de desplazamiento al principio, de manera infinita
        this.scrollPosition = 0;
      }
    } else if (direction === 'prev') {
      // Disminuir la posición de desplazamiento
      this.scrollPosition -= this.cardWidth * numVisible;

      // Si estamos al principio, volver al final
      if (this.scrollPosition < 0) {
        // Desplazarse al final del contenedor
        this.scrollPosition = maxScroll;
      }
    }

    // Aplicar la transformación para el desplazamiento
    container.style.transform = `translateX(-${this.scrollPosition}px)`;
  }



  scrollBooksPremium(direction: 'prev' | 'next'): void {
    const container = this.sliderPremiumContainer.nativeElement.querySelector('#slider-premium-wrapper');
    const numVisible = Math.floor(container.offsetWidth / this.cardWidth);
    const maxScroll = container.scrollWidth - container.offsetWidth;

    if (direction === 'next') {
      this.scrollPosition += this.cardWidth * numVisible;
      if (this.scrollPosition > maxScroll) {
        this.scrollPosition = 0;
      }
    } else if (direction === 'prev') {
      this.scrollPosition -= this.cardWidth * numVisible;
      if (this.scrollPosition < 0) {
        this.scrollPosition = maxScroll;
      }
    }

    container.style.transform = `translateX(-${this.scrollPosition}px)`;
  }

  addBookToCart(id: number) {
    if (this.sessionService.get("userRole") === null) {
      this.router.navigate(['/login'])
    } else {
      this.bookCartService.addBookId(id)
    }
  }

  constructor() {
    this.searchTerm$.pipe(debounceTime(500)).subscribe(term => this.fetchBooks(term));
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.searchTerm$.next(inputElement.value);
    }
  }

  fetchBooks(term: string) {
    if (!term.trim()) {
      this.searchResults = [];
      this.searchNoResults = false;
      return;
    }

    this.bookService.getBooks().subscribe(response => {
      if (response.status) {
        this.searchResults = (response.data as Book[]).filter((book: Book) =>
          book.status !== "ELIMINADO" &&
          (book.title.toLowerCase().includes(term.toLowerCase()) ||
          book.isbn.includes(term))
        );
        this.searchNoResults = this.searchResults.length === 0;
      }
    });
  }

}

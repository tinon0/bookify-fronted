import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent } from "../sidebar/sidebar.component";
import Swal from 'sweetalert2';
import { LogoutComponent } from "../logout/logout.component";
import { BookifyLogoComponent } from "../bookify-logo/bookify-logo.component";

@Component({
  selector: 'app-admin-view-books',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, SidebarComponent, LogoutComponent, BookifyLogoComponent],
  templateUrl: './admin-view-books.component.html',
  styleUrl: './admin-view-books.component.css',
})
export class AdminViewBooksComponent implements OnInit {
  currentYear = new Date().getFullYear();

  private bookService: BookService = inject(BookService);
  books: Book[] = [];
  selectedBook: Book = {
    id_book: 0,
    title: '',
    author: '',
    genre: '',
    editorial: '',
    publication_year: 0,
    isbn: '',
    image_file_path: '',
    reservation_price: 0,
    is_premium: false,
    status: '',
  };
  selectedBookIdDelete: number | undefined
  selectedImageFile: File | null = null;
  searchText: string = "";
  filterPremium: boolean = false;
  filterNormal: boolean = false;
  filterLibre: boolean = false;
  filterReservado: boolean = false;
  filterEliminado: boolean = false;

  newBookForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    author: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    editorial: new FormControl('', [Validators.required]),
    publication_year: new FormControl(null, [Validators.required]),
    isbn: new FormControl('', [Validators.required, Validators.pattern("^[0-9-]+$")]),
    reservation_price: new FormControl(0, [Validators.required, Validators.min(0)]),
    is_premium: new FormControl(false),
    image: new FormControl(false, [Validators.required, Validators.requiredTrue])
  })

  selectedNewImageFile: File | null = null;
  showPrice: boolean = false;
  isLoading: boolean= false;

  ngOnInit(): void {
    this.bookService
      .getBooks()
      .subscribe((response) => (this.books = response.data as Book[]));
  }

  toggleAccordion(bookId: number) {
    const element = document.getElementById(`accordion${bookId}`);
    if (element) {
      element.classList.toggle('show');
    }
  }

  setSelectedBook(selectedBook: Book) {
    this.selectedBook = { ...selectedBook };
  }

  deleteBook(bookId: number) {    
    this.bookService.deleteBook(bookId).subscribe({
      next: (response) => {
        if (response.status) {
          Swal.fire({
          icon: "success",
          title: "Libro Eliminado Correctamente!",
          showConfirmButton: true,
          timer: 2000
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Solo recarga cuando el usuario confirma
          }
        });
        } else {
          Swal.fire({
          icon: "error",
          title: "Hubo un error al eliminar el libro",
          text: response.message,
          showConfirmButton: true,
          timer: 3000
        });
          console.error(response.message);
        }
      },
      error: (error) => console.error(error)
    })
  }

  setBookToDelete(book: Book) {
    this.selectedBookIdDelete = book.id_book; // Guardar el libro para mostrar en el modal
  }

  confirmDelete() {
    if (!this.selectedBookIdDelete) return;

    this.deleteBook(this.selectedBookIdDelete); // Llamar a la función de eliminación
    this.selectedBookIdDelete = undefined; // Reiniciar el libro seleccionado
  }

  updateBook() {
    if (!this.selectedBook) return;

    const imageFile = this.selectedImageFile;

    this.bookService.updateBook(this.selectedBook, imageFile).subscribe({
      next: (response) => {
        if (response.status) {
          Swal.fire({
          icon: "success",
          title: "Libro Modificado Correctamente!",
          text: "Presiona OK para continuar",
          confirmButtonText: "OK",
          }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Solo recarga cuando el usuario confirma
          }
        });
        } else {
          Swal.fire({
          icon: "error",
          title: "Error al modificar el libro",
          text: response.message,
          showConfirmButton: false,
          timer: 2000
          });
          console.error(response.message);
        }
      },
      error: (err) => console.error("Error al modificar el libro:", err),
    });
  }

  togglePriceFieldUpdate(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    if (value === 'true') {
      this.showPrice = true
    }
    if (value === 'false') {
      this.showPrice = false
      this.selectedBook.reservation_price = 0
    }
  }

  uploadImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedImageFile = fileInput.files[0];
    }
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

      // Filtro de estado (Libre/Reservado)
      const matchesStatus = (!this.filterLibre && !this.filterReservado && !this.filterEliminado) ||
        (this.filterLibre && book.status === "LIBRE") ||
        (this.filterReservado && book.status === "RESERVADO") ||
        (this.filterEliminado && book.status === "ELIMINADO");

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  clearFilters() {
    this.filterPremium = false;
    this.filterNormal = false;
    this.filterLibre = false;
    this.filterReservado = false;
  }

  newUploadImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    this.selectedNewImageFile = fileInput.files[0];
    this.newBookForm.patchValue({ image: true });
    this.newBookForm.get('image')?.updateValueAndValidity(); // Refrescar validaciones
  } else {
    this.newBookForm.patchValue({ image: false });
    this.newBookForm.get('image')?.updateValueAndValidity();
  }
  }

  togglePriceField(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    if (value === 'true') {
      this.showPrice = true
    }
    if (value === 'false') {
      this.showPrice = false
      this.newBookForm.patchValue({
        reservation_price : 0
      })
    }
  }
  setPremiumFalse() {
    this.newBookForm.patchValue({
      is_premium: false
    })
  }


  createBook() {
    this.isLoading = true
    this.bookService.createBook(this.newBookForm.value, this.selectedNewImageFile).subscribe({
      next: (response) => {
        if (response.status) {
          this.isLoading = false
          Swal.fire({
          icon: "success",
          title: "Libro Creado Correctamente!",
          text: "Presiona OK para continuar",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Solo recarga cuando el usuario confirma
          }
        });
        } else {
          Swal.fire({
          icon: "error",
          title: "Error al crear el libro",
          text: response.message,
          showConfirmButton: false,
          timer: 2000
        });
          console.error(response.message);
        }
      },
      error: (error) => {
        this.isLoading = false
        console.error(error)
      }
    })
  }

}

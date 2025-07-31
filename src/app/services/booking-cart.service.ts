import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BookingCartService {

  private bookIds: number[] = []

  getBookIds() {
    return this.bookIds
  }
  addBookId(idBook: number): void {
    if (this.bookIds.includes(idBook)) {
      Swal.fire('Este libro ya está en tu reserva.');
      return;
    }

    this.bookIds.push(idBook);
  }

  getCountBooksReserved() {
    return this.bookIds.length
  }
  removeBookId(idBook: number) {
    const index = this.bookIds.findIndex(id => id === idBook);
    if (index !== -1) {
      this.bookIds.splice(index, 1);
    }
  }
  emptyCart() {
    this.bookIds = [];
  }

}

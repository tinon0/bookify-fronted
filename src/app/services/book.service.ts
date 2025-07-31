import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseBase } from '../models/responseBase';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http : HttpClient = inject(HttpClient)
  private sessionService : SessionService = inject(SessionService)

  getBooks() {
    return this.http.get<ResponseBase>("http://localhost:8080/book")
  }
  getBookById(idBook : number) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
        });
    return this.http.get<ResponseBase>(`http://localhost:8080/book/${idBook}`, {headers})
  }


  updateBook(book: any, imageFile: File | null) {

    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });


    const formData = new FormData();

    formData.append('id_book', book.id_book.toString());
    if (book.title) formData.append('new_title', book.title);
    if (book.author) formData.append('new_author', book.author);
    if (book.genre) formData.append('new_genre', book.genre);
    if (book.editorial) formData.append('new_editorial', book.editorial);
    if (book.publication_year) formData.append('new_publication_year', book.publication_year.toString());
    if (book.isbn) formData.append('new_isbn', book.isbn);
    if (book.reservation_price) formData.append('new_reservation_price', book.reservation_price.toString());
    if (book.is_premium !== undefined) formData.append('new_is_premium', book.is_premium.toString());

    if (imageFile) {
      formData.append('new_image_file', imageFile);
    }

    return this.http.put<ResponseBase>("http://localhost:8080/book", formData, { headers });
  }

  createBook(newBook : any, imageFile: File | null) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("genre", newBook.genre);
    formData.append("editorial", newBook.editorial);
    formData.append("publication_year", newBook.publication_year.toString());
    formData.append("isbn", newBook.isbn);
    formData.append("reservation_price", newBook.reservation_price.toString());
    formData.append("is_premium", newBook.is_premium.toString());

    if (imageFile) {
        formData.append("image_file", imageFile);
    }
    return this.http.post<ResponseBase>("http://localhost:8080/book", formData, { headers })
  }



  deleteBook(idBook : any) {
    const headers = new HttpHeaders({
          'Authorization': `${this.sessionService.get("authHeader")}`
    });
    return this.http.delete<ResponseBase>(`http://localhost:8080/book?idBook=${idBook}`, { headers })
  }
}

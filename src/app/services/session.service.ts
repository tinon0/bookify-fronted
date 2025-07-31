import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  set(key: string, value: string) {
    sessionStorage.setItem(key, value)
  }
  get(key: string) {
    return sessionStorage.getItem(key) ?? null
  }
  delete(key: string) {
    sessionStorage.removeItem(key)
  }
  setIdClient(id : any) {
    sessionStorage.setItem("client_id", id)
  }
  getIdClient() {
    return sessionStorage.getItem("client_id")
  }
  removeIdClient() {
    sessionStorage.removeItem("client_id")
  }
}

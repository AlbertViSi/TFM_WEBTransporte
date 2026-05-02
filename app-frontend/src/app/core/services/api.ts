import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  get(url: string) {
    return this.http.get(`${this.apiUrl}${url}`);
  }

  post(url: string, data: any) {
    return this.http.post(`${this.apiUrl}${url}`, data);
  }

  put(url: string, data: any) {
    return this.http.put(`${this.apiUrl}${url}`, data);
  }

  delete(url: string) {
    return this.http.delete(`${this.apiUrl}${url}`);
  }
}
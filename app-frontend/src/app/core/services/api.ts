import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environmentprod } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private http = inject(HttpClient);

  private apiUrl = environmentprod.apiUrl;

  get<T>(url: string, options = {}) {
    return this.http.get<T>(
      `${this.apiUrl}${url}`,
      options
    );
  }

  post<T>(url: string, data: any, options = {}) {
    return this.http.post<T>(
      `${this.apiUrl}${url}`,
      data,
      options
    );
  }

  put<T>(url: string, data: any, options = {}) {
    return this.http.put<T>(
      `${this.apiUrl}${url}`,
      data,
      options
    );
  }

  delete<T>(url: string, options = {}) {
    return this.http.delete<T>(
      `${this.apiUrl}${url}`,
      options
    );
  }
}
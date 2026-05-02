import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AdminBansService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBans() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      this.apiUrl + API_ENDPOINTS.bans.getAll,
      { headers }
    );
  }

  createBan(data: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.apiUrl + API_ENDPOINTS.bans.create,
      data,
      { headers }
    );
  }

  deleteBan(id: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(
      this.apiUrl + API_ENDPOINTS.bans.delete(id),
      { headers }
    );
  }

}
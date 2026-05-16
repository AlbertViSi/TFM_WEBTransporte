import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsers() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(
      this.apiUrl + API_ENDPOINTS.users.getAll,
      { headers }
    );
  }

  //Solo desactiva usuario
  deleteUser(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(
      this.apiUrl + API_ENDPOINTS.users.deactivate(id),
      {},
      { headers }
    );
  }

  reactivateUser(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(
      this.apiUrl + API_ENDPOINTS.users.reactivate(id),
      {},
      { headers }
    );
  }

  createUser(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.apiUrl + API_ENDPOINTS.users.create,
      data,
      { headers }
    );
  }
}
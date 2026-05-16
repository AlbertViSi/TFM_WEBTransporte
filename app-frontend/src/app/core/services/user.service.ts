import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = inject(Api);;

  constructor() {}

  getUsers() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.get(
      API_ENDPOINTS.users.getAll,
      { headers }
    );
  }

  //Solo desactiva usuario
  deleteUser(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.put(
      API_ENDPOINTS.users.deactivate(id),
      {},
      { headers }
    );
  }

  reactivateUser(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.put(
      API_ENDPOINTS.users.reactivate(id),
      {},
      { headers }
    );
  }

  createUser(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.post(
      API_ENDPOINTS.users.create,
      data,
      { headers }
    );
  }
}
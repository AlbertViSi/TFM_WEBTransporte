import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class AdminBansService {

  private api = inject(Api);

  constructor() {}

  getBans() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.get(
      API_ENDPOINTS.bans.getAll,
      { headers }
    );
  }

  createBan(data: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.post(
      API_ENDPOINTS.bans.create,
      data,
      { headers }
    );
  }

  deleteBan(id: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.delete(
      API_ENDPOINTS.bans.delete(id),
      { headers }
    );
  }

}
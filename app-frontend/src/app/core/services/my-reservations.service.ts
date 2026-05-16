import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { MyReservation } from '../../shared/models/myreservation.model';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class MyReservationsService {

  private api = inject(Api);

  constructor() {}

  getUserReservations(): Observable<MyReservation[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.get<MyReservation[]>(
      API_ENDPOINTS.reservations.user,
      { headers }
    );
  }

  deleteReservation(id: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.delete(
      API_ENDPOINTS.reservations.delete(id),
      { headers }
    );
  }

}
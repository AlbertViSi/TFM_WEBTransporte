import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { MyReservation } from '../../shared/models/myreservation.model';

@Injectable({
  providedIn: 'root'
})
export class MyReservationsService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUserReservations(): Observable<MyReservation[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<MyReservation[]>(
      this.apiUrl + API_ENDPOINTS.reservations.user,
      { headers }
    );
  }

  deleteReservation(id: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(
      this.apiUrl + API_ENDPOINTS.reservations.delete(id),
      { headers }
    );
  }

}
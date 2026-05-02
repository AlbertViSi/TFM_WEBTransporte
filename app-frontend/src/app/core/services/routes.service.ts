import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders

 } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  searchRoutes(origin: number, dest: number, date: string): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl + API_ENDPOINTS.routes.search(origin, dest, date)
    );

  }

  getRouteDetail(routeId: number | string) {
    return this.http.get(
      `${this.apiUrl}${API_ENDPOINTS.routes.DETAIL(routeId)}`
    );
  }

  createReservation(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.reservations.create}`,
      data,
      { headers }
    );
  }

}
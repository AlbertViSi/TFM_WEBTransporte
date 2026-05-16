import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private api = inject(Api);;

  constructor() {}

  searchRoutes(origin: number, dest: number, date: string): Observable<any[]> {

    return this.api.get<any[]>(
      API_ENDPOINTS.routes.search(origin, dest, date)
    );

  }

  getRouteDetail(routeId: number | string) {
    return this.api.get(
      API_ENDPOINTS.routes.DETAIL(routeId)
    );
  }

  createReservation(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.post(
      API_ENDPOINTS.reservations.create,
      data,
      { headers }
    );
  }

  getAllRoutes() {
    return this.api.get<any[]>(
      API_ENDPOINTS.routes.getAll
    );
  }

  getCommentsByRoute(routeId: number) {

    return this.api.get(
      API_ENDPOINTS.comments.getByRoute(routeId)
    );

  }

  deleteComment(commentId: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.delete(
      API_ENDPOINTS.comments.delete(commentId),
      { headers }
    );

  }

  updateCapacity(routeId: number, capacity: number) {
    return this.api.put<any[]>(
      API_ENDPOINTS.routes.updateCapacity(routeId),
      { capacity }
    );
  }

  updateBasePrice(routeId: number, base_price: number) {
    return this.api.put<any[]>(
      API_ENDPOINTS.routes.updateBasePrice(routeId),
      { base_price }
    );
  }

}
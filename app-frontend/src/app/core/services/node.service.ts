import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getNodes(): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.getAll}`
    );
  }

  getAvailableDestinations(id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.availableDestinations(id)}`
    );
  }

}
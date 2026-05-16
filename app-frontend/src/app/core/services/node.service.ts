import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

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

  getMainNodes() {
    return this.http.get<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.getMain}`
    );
  }

  getSubnodes() {
    return this.http.get<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.getSubnodes}`
    );
  }

  getNodesByRoute(routeId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.routes.nodesByRoute(routeId)}`,
    )
  }

  createSubnode(data: any) {
    return this.http.post<any>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.createSubnode}`,
      data
    )
  }

  deleteSubnode(id: number) {
    return this.http.delete<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.deleteSubnode(id)}`,
    )
  }

  reassignSubnode(id: number, body: { new_parent_id: number }) {
    return this.http.put<any[]>(
      `${this.apiUrl}${API_ENDPOINTS.nodes.reassignSubnode(id)}`,
      body
    );
  }

}
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private api = inject(Api);;

  constructor() {}

  getNodes(): Observable<any> {
    return this.api.get<any[]>(
      API_ENDPOINTS.nodes.getAll
    );
  }

  getAvailableDestinations(id: number): Observable<any[]> {
    return this.api.get<any[]>(
      API_ENDPOINTS.nodes.availableDestinations(id)
    );
  }

  getMainNodes() {
    return this.api.get<any[]>(
      API_ENDPOINTS.nodes.getMain
    );
  }

  getSubnodes() {
    return this.api.get<any[]>(
      API_ENDPOINTS.nodes.getSubnodes
    );
  }

  getNodesByRoute(routeId: number): Observable<any[]> {
    return this.api.get<any[]>(
      API_ENDPOINTS.routes.nodesByRoute(routeId)
    )
  }

  createSubnode(data: any) {
    return this.api.post<any>(
      API_ENDPOINTS.nodes.createSubnode,
      data
    )
  }

  deleteSubnode(id: number) {
    return this.api.delete<any[]>(
      API_ENDPOINTS.nodes.deleteSubnode(id),
    )
  }

  reassignSubnode(id: number, body: { new_parent_id: number }) {
    return this.api.put<any[]>(
      API_ENDPOINTS.nodes.reassignSubnode(id),
      body
    );
  }

}
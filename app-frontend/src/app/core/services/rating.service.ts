import { Injectable, inject } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { API_ENDPOINTS } from "../endpoints/api-endpoints";
import { Api } from "./api";

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private api = inject(Api);;

  constructor() {}

  createRating(route_id: number, rating: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.post(
      API_ENDPOINTS.ratings.create,
      { route_id, rating },
      { headers }
    );
  }

  createComment(route_id: number, content: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.api.post(
      API_ENDPOINTS.comments.create,
      { route_id, content },
      { headers }
    );
  }

}
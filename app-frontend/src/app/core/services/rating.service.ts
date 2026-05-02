import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_ENDPOINTS } from "../endpoints/api-endpoints";

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createRating(route_id: number, rating: number) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.apiUrl + API_ENDPOINTS.ratings.create,
      { route_id, rating },
      { headers }
    );
  }

  createComment(route_id: number, content: string) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.apiUrl + API_ENDPOINTS.comments.create,
      { route_id, content },
      { headers }
    );
  }

}
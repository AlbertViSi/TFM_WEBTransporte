import { Injectable, inject } from '@angular/core';
import { Api } from './api';
import { BehaviorSubject } from 'rxjs';
import { RegisterDto } from '../../shared/models/user.model';
import { API_ENDPOINTS } from '../endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = inject(Api);

  private userSubject = new BehaviorSubject<any>(this.loadUser());
  user$ = this.userSubject.asObservable();

  login( username: any , password: any ) {
    return this.api.post(API_ENDPOINTS.auth.login, { username, password });
  }

  register(data: RegisterDto) {
    return this.api.post(API_ENDPOINTS.auth.register, data);
  }

  profile() {
    return this.api.get(API_ENDPOINTS.auth.profile);
  }

  setUser(session: any) {
    console.log("SET USER:", session);
    localStorage.setItem('user', JSON.stringify(session));
    localStorage.setItem('token', session.token);

    this.userSubject.next(session.user);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    this.userSubject.next(null);
  }

  // validar login
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRoleId(): number | null {
    const user = this.userSubject.value;
    return user?.role_id ?? null;
  }

  isAdmin(): boolean {
    return this.getRoleId() === 1;
  }

  init() {
    const user = localStorage.getItem('user');

    if (user) {
      this.userSubject.next(JSON.parse(user).user);
    }
  }

  private loadUser() {
    const user = localStorage.getItem('user');
    const parsed = user ? JSON.parse(user) : null;
    return parsed?.user ?? null;
  }
}

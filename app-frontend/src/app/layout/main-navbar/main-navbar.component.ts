import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ROLE } from '../../shared/roles';

@Component({
  selector: 'app-main-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    RouterLinkActive,
  ],
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.scss',
})
export class MainNavbarComponent {
  auth = inject(AuthService);
  ROLE = ROLE;
  user$ = this.auth.user$;

  hasRole(user: any, roles: string[]): boolean {
    return roles.includes(user.role_name);
  }
}

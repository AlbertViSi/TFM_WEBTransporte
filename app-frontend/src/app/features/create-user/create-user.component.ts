import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {

  username = '';
  email = '';
  password = '';
  role = '';

  constructor(
    private usersService: UserService,
    private router: Router
  ) {}

  createUser() {
    
    if (!this.username || !this.email || !this.password || !this.role) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const data = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.usersService.createUser(data)
      .subscribe(() => {
        this.router.navigate(['/adminusuarios']);
      });
  }
}
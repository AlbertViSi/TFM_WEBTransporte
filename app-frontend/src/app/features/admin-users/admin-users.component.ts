import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class UserComponent {
  users: User[] = [];

  constructor(
    private usersService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe((data: any) => {
      this.users = data;
      this.cd.detectChanges();
    });
  }

  search = '';

  get filteredUsers() {
    if (!this.search) return this.users;

    const term = this.search.toLowerCase();

    return this.users.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  deleteUser(id: number) {
    if (!confirm("¿Eliminar usuario?")) return;

    this.usersService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  toggleUser(user: User) {
    const action = user.active ? 'desactivar' : 'reactivar';

    if (!confirm(`¿Seguro que deseas ${action} este usuario?`)) return;

    const request = user.active
      ? this.usersService.deleteUser(user.id)
      : this.usersService.reactivateUser(user.id);

    request.subscribe(() => {
      this.loadUsers();
    });
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'Usuario';
      case 3: return 'Moderador';
      case 4: return 'Node Builder';
      default: return 'Desconocido';
    }
  }

  goToCreateUser() {
    this.router.navigate(['/adminusuarios/create']);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Api } from '../../core/services/api';
import { API_ENDPOINTS } from '../../core/endpoints/api-endpoints';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  
  private auth = inject(AuthService);
  private api = inject(Api);
  private fb = inject(FormBuilder);

  user: any;

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  ngOnInit(): void{
    this.loadProfile();
  }

  loadProfile() {
    this.api.get(API_ENDPOINTS.auth.profile).subscribe({
      next: (res: any) => {
        this.user = res;
      }
    });
  }

  changePassword() {

    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.api.put(API_ENDPOINTS.auth.changePassword, {
      current_password: currentPassword,
      new_password: newPassword
    }).subscribe({
      next: () => {
        alert('Contraseña cambiada correctamente');
        this.passwordForm.reset();
      },
      error: () => {
        alert('Error al cambiar contraseña');
      }
    });

  }

}
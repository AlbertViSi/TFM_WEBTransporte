import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminBansService } from '../../../core/services/admin-bans.service';

@Component({
  selector: 'app-create-ban',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ban.component.html',
  styleUrl: './create-ban.component.scss',
})
export class CreateBanComponent {

  dni: string = '';
  reason: string = '';
  expires_at: string = '';

  constructor(
    private bansService: AdminBansService,
    private router: Router
  ) {}

  submit() {

    const data = {
      dni: this.dni,
      reason: this.reason,
      expires_at: this.expires_at || null
    };

    this.bansService.createBan(data).subscribe({
      next: () => {
        this.router.navigate(['/listbans']);
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

}
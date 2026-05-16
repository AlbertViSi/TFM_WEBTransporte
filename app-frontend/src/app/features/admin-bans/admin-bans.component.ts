import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminBansService } from '../../core/services/admin-bans.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-bans',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './admin-bans.component.html',
  styleUrl: './admin-bans.component.scss',
})
export class AdminBansComponent {

  bans: any[] = [];

  dni = '';
  reason = '';
  expires_at = '';
  search = '';

  constructor(
    private bansService: AdminBansService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadBans();
  }

  loadBans() {
    this.bansService.getBans()
      .subscribe((data: any) => {
        this.bans = data;
        this.cd.detectChanges();
      });
  }

  createBan() {

    const data = {
      dni: this.dni,
      reason: this.reason,
      expires_at: this.expires_at
    };

    this.bansService.createBan(data)
      .subscribe(() => {
        this.loadBans();
        this.dni = '';
        this.reason = '';
        this.expires_at = '';
      });

  }

  deleteBan(id: number) {

    if (!confirm("¿Eliminar baneo?")) return;

    this.bansService.deleteBan(id)
      .subscribe(() => {
        this.loadBans();
      });

  }

  get filteredBans() {
    return this.bans.filter(b =>
      b.dni.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  goToBanCreate(){
    this.router.navigate(['/listbans/create']);
  }

}
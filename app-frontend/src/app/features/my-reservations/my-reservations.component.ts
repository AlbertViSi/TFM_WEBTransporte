import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyReservationsService } from '../../core/services/my-reservations.service';
import { MyReservation } from '../../shared/models/myreservation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {

  reservations: MyReservation[] = [];
  loading = true;

  constructor(
    private reservationsService: MyReservationsService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationsService.getUserReservations()
      .subscribe({
        next: (data) => {
          this.reservations = data;
          this.loading = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  cancelReservation(id: number) {
    if (!confirm("¿Cancelar reserva?")) return;

    this.reservationsService.deleteReservation(id)
      .subscribe(() => {
        this.loadReservations();
      });
  }

  goToRating(routeId: number) {
    this.router.navigate(['/rate-route', routeId]);
  }

}
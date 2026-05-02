import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationStateService } from '../../core/services/reservation-state.service';
import { RoutesService } from '../../core/services/routes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent {

  loading = false;
  error = '';
  success = false;

  constructor(
    private reservationState: ReservationStateService,
    private routesService: RoutesService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  confirmPayment() {

    this.loading = true;

    const data = this.reservationState;

    this.routesService.createReservation({
      route_id: data.routeId,
      departure_date: data.date,
      dni: data.dni,
      origin_node_id: data.originId,
      destination_node_id: data.destinationId
    })
    .subscribe({
      next: (res) => {
        this.success = true;
        this.loading = false;

        //console.log("Reserva creada:", res);

        this.reservationState.clear();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al crear reserva';
        this.loading = false;
      }
    });

  }

  rejectPayment() {
    this.error = 'El pago ha fallado';
    this.success = false;
    this.loading = false;
  }

  goHome() {
    this.router.navigate(['/']);
  }

}
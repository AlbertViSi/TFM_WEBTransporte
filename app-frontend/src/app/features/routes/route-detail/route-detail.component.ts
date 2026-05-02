import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutesService } from '../../../core/services/routes.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'
import { ReservationStateService } from '../../../core/services/reservation-state.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './route-detail.component.html',
  styleUrl: './route-detail.component.scss',
})

export class RouteDetailComponent implements OnInit {

  route: any;
  ratingAvg = 0;
  ratingCount = 0;
  comments: any[] = [];
  originName = '';
  destinationName = '';
  date = '';
  price=0;

  constructor(
    private routeParam: ActivatedRoute,
    private routesService: RoutesService,
    private cd: ChangeDetectorRef,
    private reservationState: ReservationStateService,
    private authService: AuthService,
    private router: Router
  ) {}

  goToReservation() {
    const routeId = this.routeParam.snapshot.paramMap.get('id');
    if (Number(routeId) === 11) {
      alert("Reservas para viajes locales no disponibles por ahora");
    }
    else{this.router.navigate(['/payment']);}
  }

  isLogged = false;

  ngOnInit() {

    this.isLogged = this.authService.isLoggedIn();
    this.originName = this.reservationState.originName || '';
    this.destinationName = this.reservationState.destinationName || '';
    this.date = this.reservationState.date || '';
    this.price = Number((this.reservationState.price || 0).toFixed(2));

    this.reservationState.save();

    const routeId = this.routeParam.snapshot.paramMap.get('id');

    if (!routeId) return;
    this.routesService
      .getRouteDetail(routeId)
      .subscribe((data: any) => {
        this.route = data.route;
        this.ratingAvg = data.rating_avg;
        this.ratingCount = data.rating_count;
        this.comments = data.comments;
        this.cd.detectChanges();
      });
  }
}
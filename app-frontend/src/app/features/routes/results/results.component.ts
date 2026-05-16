import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutesService } from '../../../core/services/routes.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ReservationStateService } from '../../../core/services/reservation-state.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  loading = true

  constructor(
    private route: ActivatedRoute,
    private routesService: RoutesService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private reservationState: ReservationStateService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      
      const origin = params['origin'];
      const destination = params['destination'];
      const date = params['date'];

      if (!origin || !destination || !date) return;

      this.routesService
        .searchRoutes(origin, destination, date)
        .subscribe(data => {
          this.results = data;
          //console.log(data);
          this.loading = false;
          this.cd.detectChanges();
        });

    });

  }

  goToDetail(route: any) {
    
    const routeId = route.route_id ?? 11;

    this.reservationState.routeId = routeId;
    this.reservationState.routeName = route.route_name;
    this.reservationState.price = route.estimated_price;
    this.reservationState.distance = route.estimated_distance;
    
    this.reservationState.save();

    this.router.navigate(['/route-detail', routeId]);

  }
}

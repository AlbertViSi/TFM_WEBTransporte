import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutofillComponent } from '../../../autofill/autofill.component';
import { NodeService } from '../../../core/services/node.service'; 
import { RoutesService } from '../../../core/services/routes.service';
import { Router } from '@angular/router';
import { ReservationStateService } from '../../../core/services/reservation-state.service';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutofillComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class Search implements OnInit{
  
  private fb = inject(FormBuilder);

  constructor(
    private nodeService: NodeService,
    private routesService: RoutesService,
    private router: Router,
    private reservationState: ReservationStateService
  ) {}

  form = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    date: ['', Validators.required]
  });

  minDate!: string;
  origins: any[] = [];
  destinations: any[] = [];
  originId!: number;
  destinationId!: number

  results: any[] = [];

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.nodeService.getNodes().subscribe((nodes: any[]) => {
      this.origins = nodes;
    });
  }

  search() {
    
    if (this.form.invalid) return;

    //Fragmento de update de datos para reserva
    this.reservationState.originId = this.originId;
    this.reservationState.destinationId = this.destinationId;
    this.reservationState.date = this.form.value.date!;
    this.reservationState.originName = this.form.value.origin!;
    this.reservationState.destinationName = this.form.value.destination!;
    //Guardando datos en local storage
    this.reservationState.save();

    this.routesService
      .searchRoutes(
        this.originId,
        this.destinationId,
        this.form.value.date!
      )
      .subscribe({
        next: (routes) => {
          this.results = routes;
        },
        error: (err) => {
          console.error(err);
          this.results = [];
        }
      });
    this.router.navigate(['/results'], {
      queryParams: {
        origin: this.originId,
        destination: this.destinationId,
        date: this.form.value.date
      }
    });
  }

  originLocked = false;
  setOrigin(node: any) {

    this.originId = node.id;

    this.form.patchValue({
      origin: node.name
    });

    this.nodeService
      .getAvailableDestinations(node.id)
      .subscribe(destinations => {
        this.destinations = destinations;
      });

  }

  setDestination(node: any) {
    this.destinationId = node.id;

    this.form.patchValue({
      destination: node.name
    });
  }
}

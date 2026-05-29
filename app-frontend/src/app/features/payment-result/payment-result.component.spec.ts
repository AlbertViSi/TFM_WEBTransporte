import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentResultComponent } from './payment-result.component';
import { ReservationStateService } from '../../core/services/reservation-state.service';
import { RoutesService } from '../../core/services/routes.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('PaymentResultComponent', () => {

  let component: PaymentResultComponent;
  let fixture: ComponentFixture<PaymentResultComponent>;

  let reservationStateSpy: any;
  let routesServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    routesServiceSpy = {
      createReservation: vi.fn()
    };

    reservationStateSpy = {
      routeId: 1,
      date: '2026-05-27',
      dni: '12345678A',
      originId: 10,
      destinationId: 20,
      clear: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PaymentResultComponent],
      providers: [
        { provide: ReservationStateService, useValue: reservationStateSpy },
        { provide: RoutesService, useValue: routesServiceSpy },
        { provide: Router, useValue: routerSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentResultComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();

  });

  it('deberia confirmar pago correctamente OK', () => {

    routesServiceSpy.createReservation.mockReturnValue(
      of({ message: 'Reserva creada' })
    );

    component.confirmPayment();

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);

    expect(routesServiceSpy.createReservation).toHaveBeenCalledWith({
      route_id: 1,
      departure_date: '2026-05-27',
      dni: '12345678A',
      origin_node_id: 10,
      destination_node_id: 20
    });

    expect(reservationStateSpy.clear).toHaveBeenCalled();

  });

  it('deberia manejar error al confirmar pago OK', () => {

    routesServiceSpy.createReservation.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Error backend'
        }
      }))
    );

    component.confirmPayment();

    expect(component.success).toBe(false);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('Error backend');

  });

  it('deberia rechazar el pago correctamente OK', () => {

    component.rejectPayment();

    expect(component.success).toBe(false);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('El pago ha fallado');

  });

  it('deberia navegar al home OK', () => {

    component.goHome();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);

  });

});
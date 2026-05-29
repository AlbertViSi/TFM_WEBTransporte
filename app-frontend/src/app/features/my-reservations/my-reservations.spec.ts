import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyReservationsComponent } from './my-reservations.component';
import { MyReservationsService } from '../../core/services/my-reservations.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('MyReservationsComponent', () => {

  let component: MyReservationsComponent;
  let fixture: ComponentFixture<MyReservationsComponent>;

  let reservationsServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    reservationsServiceSpy = {
      getUserReservations: vi.fn(),
      deleteReservation: vi.fn()
    };

    reservationsServiceSpy.getUserReservations.mockReturnValue(of([]));

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MyReservationsComponent],
      providers: [
        { provide: MyReservationsService, useValue: reservationsServiceSpy },
        { provide: Router, useValue: routerSpy },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyReservationsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();

  });

  it('deberia cargar reservas correctamente OK', () => {

    const mockReservations = [
      {
        id: 1,
        route_id: 10,
        route_name: 'Ruta Madrid',
        origin_name: 'Barcelona',
        destination_name: 'Madrid',
        departure_date: '2026-05-27',
        total_price: 45.5,
        status: 'CONFIRMED',
        dni: '12345678A'
      }
    ];

    reservationsServiceSpy.getUserReservations.mockReturnValue(
      of(mockReservations)
    );

    component.loadReservations();

    expect(reservationsServiceSpy.getUserReservations).toHaveBeenCalled();

    expect(component.reservations).toEqual(mockReservations);
    expect(component.loading).toBe(false);

  });

  it('deberia manejar error al cargar reservas OK', () => {

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    reservationsServiceSpy.getUserReservations.mockReturnValue(
      throwError(() => new Error('Error backend'))
    );

    component.loadReservations();

    expect(consoleSpy).toHaveBeenCalled();
    expect(component.loading).toBe(false);

    consoleSpy.mockRestore();

  });

  it('deberia cancelar reserva correctamente OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    reservationsServiceSpy.deleteReservation.mockReturnValue(
      of({})
    );

    const loadSpy = vi.spyOn(component, 'loadReservations');

    component.cancelReservation(1);

    expect(reservationsServiceSpy.deleteReservation)
      .toHaveBeenCalledWith(1);

    expect(loadSpy).toHaveBeenCalled();

  });

  it('no deberia cancelar reserva si usuario cancela confirmacion OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.cancelReservation(1);

    expect(reservationsServiceSpy.deleteReservation)
      .not.toHaveBeenCalled();

  });

  it('deberia navegar a pantalla de valoracion OK', () => {

    component.goToRating(5);

    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(['/rate-route', 5]);

  });

});
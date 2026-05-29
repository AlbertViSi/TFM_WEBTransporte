import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteDetailComponent } from './route-detail.component';

import { ActivatedRoute, Router } from '@angular/router';
import { RoutesService } from '../../../core/services/routes.service';
import { ReservationStateService } from '../../../core/services/reservation-state.service';
import { AuthService } from '../../../core/services/auth.service';

import { ChangeDetectorRef } from '@angular/core';

import { of } from 'rxjs';
import { vi } from 'vitest';

describe('RouteDetailComponent', () => {

  let component: RouteDetailComponent;
  let fixture: ComponentFixture<RouteDetailComponent>;

  let routesServiceSpy: any;
  let reservationStateSpy: any;
  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    routesServiceSpy = {
      getRouteDetail: vi.fn()
    };

    reservationStateSpy = {
      originName: 'Madrid',
      destinationName: 'Barcelona',
      date: '2026-01-01',
      price: 25.5,
      save: vi.fn()
    };

    authServiceSpy = {
      isLoggedIn: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    routesServiceSpy.getRouteDetail.mockReturnValue(
      of({
        route: {
          id: 1,
          name: 'Ruta test'
        },
        rating_avg: 4.5,
        rating_count: 10,
        comments: [
          { text: 'Buen viaje' }
        ]
      })
    );

    authServiceSpy.isLoggedIn.mockReturnValue(true);

    await TestBed.configureTestingModule({
      imports: [RouteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue('1')
              }
            }
          }
        },
        {
          provide: RoutesService,
          useValue: routesServiceSpy
        },
        {
          provide: ReservationStateService,
          useValue: reservationStateSpy
        },
        {
          provide: AuthService,
          useValue: authServiceSpy
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RouteDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();

  });

  it('deberia cargar datos en ngOnInit OK', () => {

    expect(authServiceSpy.isLoggedIn)
      .toHaveBeenCalled();

    expect(routesServiceSpy.getRouteDetail)
      .toHaveBeenCalledWith('1');

    expect(component.route.id)
      .toBe(1);

    expect(component.ratingAvg)
      .toBe(4.5);

    expect(component.ratingCount)
      .toBe(10);

    expect(component.comments.length)
      .toBe(1);

  });

  it('deberia cargar datos del reservationState OK', () => {

    expect(component.originName)
      .toBe('Madrid');

    expect(component.destinationName)
      .toBe('Barcelona');

    expect(component.date)
      .toBe('2026-01-01');

    expect(component.price)
      .toBe(25.5);

  });

  it('deberia guardar reservationState OK', () => {

    expect(reservationStateSpy.save)
      .toHaveBeenCalled();

  });

  it('deberia navegar a payment OK', () => {

    component.goToReservation();

    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(['/payment']);

  });

  it('deberia mostrar alerta si routeId es 11 OK', () => {

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {});

    const activatedRoute: any = TestBed.inject(ActivatedRoute);

    activatedRoute.snapshot.paramMap.get
      .mockReturnValue('11');

    component.goToReservation();

    expect(window.alert)
      .toHaveBeenCalledWith(
        'Reservas para viajes locales no disponibles por ahora'
      );

  });

});
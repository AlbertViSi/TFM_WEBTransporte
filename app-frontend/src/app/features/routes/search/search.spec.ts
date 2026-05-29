import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Search } from './search.component';

import { NodeService } from '../../../core/services/node.service';
import { RoutesService } from '../../../core/services/routes.service';
import { ReservationStateService } from '../../../core/services/reservation-state.service';
import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('Search Component', () => {

  let component: Search;
  let fixture: ComponentFixture<Search>;

  let nodeServiceSpy: any;
  let routesServiceSpy: any;
  let reservationStateSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    nodeServiceSpy = {
      getNodes: vi.fn(),
      getAvailableDestinations: vi.fn()
    };

    routesServiceSpy = {
      searchRoutes: vi.fn()
    };

    reservationStateSpy = {
      save: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    nodeServiceSpy.getNodes.mockReturnValue(
      of([
        { id: 1, name: 'Madrid' },
        { id: 2, name: 'Barcelona' }
      ])
    );

    nodeServiceSpy.getAvailableDestinations.mockReturnValue(
      of([
        { id: 3, name: 'Valencia' }
      ])
    );

    await TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        { provide: NodeService, useValue: nodeServiceSpy },
        { provide: RoutesService, useValue: routesServiceSpy },
        { provide: ReservationStateService, useValue: reservationStateSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();

  });

  it('deberia cargar nodos al iniciar OK', () => {

    expect(nodeServiceSpy.getNodes).toHaveBeenCalled();

    expect(component.origins.length).toBe(2);

  });

  it('deberia establecer origen correctamente OK', () => {

    const node = {
      id: 1,
      name: 'Madrid'
    };

    component.setOrigin(node);

    expect(component.originId).toBe(1);

    expect(component.form.value.origin)
      .toBe('Madrid');

    expect(nodeServiceSpy.getAvailableDestinations)
      .toHaveBeenCalledWith(1);

    expect(component.destinations.length)
      .toBe(1);

  });

  it('deberia establecer destino correctamente OK', () => {

    const node = {
      id: 2,
      name: 'Barcelona'
    };

    component.setDestination(node);

    expect(component.destinationId).toBe(2);

    expect(component.form.value.destination)
      .toBe('Barcelona');

  });

  it('no deberia buscar si el formulario es invalido OK', () => {

    component.search();

    expect(routesServiceSpy.searchRoutes)
      .not.toHaveBeenCalled();

  });

  it('deberia buscar rutas correctamente OK', () => {

    routesServiceSpy.searchRoutes.mockReturnValue(
      of([{ id: 1 }])
    );

    component.setOrigin({
      id: 1,
      name: 'Madrid'
    });

    component.setDestination({
      id: 2,
      name: 'Barcelona'
    });

    component.form.patchValue({
      date: '2026-01-01'
    });

    component.search();

    expect(reservationStateSpy.save)
      .toHaveBeenCalled();

    expect(routesServiceSpy.searchRoutes)
      .toHaveBeenCalledWith(
        1,
        2,
        '2026-01-01'
      );

    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(
        ['/results'],
        {
          queryParams: {
            origin: 1,
            destination: 2,
            date: '2026-01-01'
          }
        }
      );

    expect(component.results.length)
      .toBe(1);

  });

  it('deberia manejar error al buscar rutas OK', () => {

    vi.spyOn(console, 'error').mockImplementation(() => {});

    routesServiceSpy.searchRoutes.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.setOrigin({
      id: 1,
      name: 'Madrid'
    });

    component.setDestination({
      id: 2,
      name: 'Barcelona'
    });

    component.form.patchValue({
      date: '2026-01-01'
    });

    component.search();

    expect(console.error).toHaveBeenCalled();

    expect(component.results)
      .toEqual([]);

  });

});
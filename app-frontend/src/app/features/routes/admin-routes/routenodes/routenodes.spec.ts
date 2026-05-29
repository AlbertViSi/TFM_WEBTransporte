import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { vi } from 'vitest';

import { RouteNodesComponent } from './routenodes.component';
import { NodeService } from '../../../../core/services/node.service';
import { RoutesService } from '../../../../core/services/routes.service';

describe('RouteNodesComponent', () => {

  let component: RouteNodesComponent;
  let fixture: ComponentFixture<RouteNodesComponent>;

  let nodeServiceSpy: any;
  let routesServiceSpy: any;
  let locationSpy: any;

  const mockNodes = [
    { id: 1, node_type: 'main' },
    { id: 2, node_type: 'secondary' }
  ];

  const mockSubnodes = [
    { id: 10, parent_node_id: 1 },
    { id: 11, parent_node_id: 2 }
  ];

  beforeEach(async () => {

    nodeServiceSpy = {
      getNodesByRoute: vi.fn().mockReturnValue(of(mockNodes)),
      getSubnodes: vi.fn().mockReturnValue(of(mockSubnodes))
    };

    routesServiceSpy = {
      getRouteDetail: vi.fn().mockReturnValue(
        of({
          route: {
            name: 'Ruta test'
          }
        })
      )
    };

    locationSpy = {
      back: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RouteNodesComponent],
      providers: [
        {
          provide: NodeService,
          useValue: nodeServiceSpy
        },
        {
          provide: RoutesService,
          useValue: routesServiceSpy
        },
        {
          provide: Location,
          useValue: locationSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue('1')
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RouteNodesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar nodos y subnodos correctamente OK', () => {

    component.load();

    expect(nodeServiceSpy.getNodesByRoute)
      .toHaveBeenCalledWith(1);

    expect(component.nodes)
      .toEqual(mockNodes);

    expect(nodeServiceSpy.getSubnodes)
      .toHaveBeenCalled();

    expect(component.subnodes)
      .toEqual(mockSubnodes);
  });

  it('deberia devolver solo nodos principales OK', () => {

    component.nodes = mockNodes;

    expect(component.mainNodes.length).toBe(1);
    expect(component.mainNodes[0].node_type).toBe('main');
  });

  it('deberia filtrar subnodos por nodo OK', () => {

    component.subnodes = mockSubnodes;

    const result = component.getSubnodes(1);

    expect(result.length).toBe(1);
    expect(result[0].parent_node_id).toBe(1);
  });

  it('deberia alternar expansion de nodos OK', () => {

    component.toggle(1);
    expect(component.isExpanded(1)).toBe(true);

    component.toggle(1);
    expect(component.isExpanded(1)).toBe(false);
  });

  it('deberia navegar hacia atras OK', () => {

    component.goBack();

    expect(locationSpy.back)
      .toHaveBeenCalled();
  });

  it('deberia cargar nombre de ruta OK', () => {

    component.loadRouteData();

    expect(routesServiceSpy.getRouteDetail)
      .toHaveBeenCalledWith(1);

    expect(component.routeName)
      .toBe('Ruta test');
  });

});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { ReassignSubnodeComponent } from './reassign-subnode.component';
import { NodeService } from '../../../../core/services/node.service';

describe('ReassignSubnodeComponent', () => {

  let component: ReassignSubnodeComponent;
  let fixture: ComponentFixture<ReassignSubnodeComponent>;

  let nodeServiceSpy: any;

  beforeEach(async () => {

    nodeServiceSpy = {
      reassignSubnode: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReassignSubnodeComponent],
      providers: [
        {
          provide: NodeService,
          useValue: nodeServiceSpy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReassignSubnodeComponent);
    component = fixture.componentInstance;

    component.subnodeId = 10;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();
  });

  it('deberia alternar showForm correctamente OK', () => {

    expect(component.showForm).toBe(false);

    component.toggle();

    expect(component.showForm).toBe(true);

    component.toggle();

    expect(component.showForm).toBe(false);
  });

  it('deberia validar newParentId antes de reasignar OK', () => {

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.newParentId = 0;

    component.reassign();

    expect(window.alert)
      .toHaveBeenCalledWith(
        'Selecciona un nodo destino'
      );

    expect(nodeServiceSpy.reassignSubnode)
      .not.toHaveBeenCalled();
  });

  it('deberia reasignar subnodo correctamente OK', () => {

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    nodeServiceSpy.reassignSubnode
      .mockReturnValue(of({}));

    const emitSpy = vi.spyOn(
      component.reassigned,
      'emit'
    );

    component.showForm = true;
    component.newParentId = 99;

    component.reassign();

    expect(nodeServiceSpy.reassignSubnode)
      .toHaveBeenCalledWith(10, {
        new_parent_id: 99
      });

    expect(window.alert)
      .toHaveBeenCalledWith(
        'Subnodo reasignado'
      );

    expect(component.showForm)
      .toBe(false);

    expect(emitSpy)
      .toHaveBeenCalled();
  });

  it('deberia manejar error al reasignar subnodo OK', () => {

    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    component.newParentId = 99;

    nodeServiceSpy.reassignSubnode.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Error backend'
        }
      }))
    );

    component.reassign();

    expect(console.error)
      .toHaveBeenCalled();

    expect(window.alert)
      .toHaveBeenCalledWith(
        'Error backend'
      );
  });

});
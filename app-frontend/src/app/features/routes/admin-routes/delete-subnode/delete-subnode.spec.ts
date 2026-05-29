import { vi } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { DeleteSubnodeComponent } from './delete-subnode.component';
import { NodeService } from '../../../../core/services/node.service';

describe('DeleteSubnodeComponent', () => {

  let component: DeleteSubnodeComponent;
  let fixture: ComponentFixture<DeleteSubnodeComponent>;

  let nodeServiceSpy: any;

  beforeEach(async () => {

    nodeServiceSpy = {
      deleteSubnode: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [DeleteSubnodeComponent],
      providers: [
        {
          provide: NodeService,
          useValue: nodeServiceSpy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSubnodeComponent);
    component = fixture.componentInstance;

    component.subnodeId = 5;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();
  });

  it('deberia eliminar subnodo correctamente OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    nodeServiceSpy.deleteSubnode
      .mockReturnValue(of({}));

    const emitSpy = vi.spyOn(component.deleted, 'emit');

    component.delete();

    expect(nodeServiceSpy.deleteSubnode)
      .toHaveBeenCalledWith(5);

    expect(window.alert)
      .toHaveBeenCalledWith('Subnodo eliminado');

    expect(emitSpy)
      .toHaveBeenCalled();
  });

  it('no deberia eliminar si cancelan confirmacion OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.delete();

    expect(nodeServiceSpy.deleteSubnode)
      .not.toHaveBeenCalled();
  });

  it('deberia manejar error al eliminar subnodo OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    nodeServiceSpy.deleteSubnode.mockReturnValue(
      throwError(() => ({
        error: {
          error: 'Error backend'
        }
      }))
    );

    component.delete();

    expect(console.error)
      .toHaveBeenCalled();

    expect(window.alert)
      .toHaveBeenCalledWith('Error backend');
  });

});
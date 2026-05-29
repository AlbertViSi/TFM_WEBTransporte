import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CommentsComponent } from './comments.component';
import { RoutesService } from '../../../../core/services/routes.service';
import { AuthService } from '../../../../core/services/auth.service';
import { vi } from 'vitest';

describe('CommentsComponent', () => {

  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  let routesServiceSpy: any;
  let locationSpy: any;

  let authSpy: any;

  authSpy = {
    hasRole: vi.fn().mockReturnValue(true),

    isAdmin: vi.fn().mockReturnValue(true),
    isModerator: vi.fn().mockReturnValue(false),
    isNodeBuilder: vi.fn().mockReturnValue(false),
    isAdminOrModerator: vi.fn().mockReturnValue(true),
    isRouteManager: vi.fn().mockReturnValue(true),

    getRole: vi.fn().mockReturnValue('ADMIN')
  };

  const mockComments = [
    {
      id: 1,
      comment: 'Muy buena ruta'
    },
    {
      id: 2,
      comment: 'Regular'
    }
  ];

  beforeEach(async () => {

    routesServiceSpy = {
      getCommentsByRoute: vi.fn().mockReturnValue(of(mockComments)),
      deleteComment: vi.fn().mockReturnValue(of({})),
      getRouteDetail: vi.fn().mockReturnValue(
        of({
          route: {
            name: 'Ruta Madrid'
          }
        })
      )
    };

    locationSpy = {
      back: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CommentsComponent],
      providers: [
        {
          provide: RoutesService,
          useValue: routesServiceSpy
        },
        {
          provide: AuthService,
          useValue: authSpy
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

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();
  });

  it('deberia cargar comentarios correctamente OK', () => {

    component.loadComments();

    expect(routesServiceSpy.getCommentsByRoute)
      .toHaveBeenCalledWith(1);

    expect(component.comments)
      .toEqual(mockComments);
  });

  it('deberia cargar nombre de ruta correctamente OK', () => {

    component.loadRouteName();

    expect(routesServiceSpy.getRouteDetail)
      .toHaveBeenCalledWith(1);

    expect(component.routeName)
      .toBe('Ruta Madrid');
  });

  it('deberia eliminar comentario correctamente OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.comments = [...mockComments];

    component.deleteComment(1);

    expect(routesServiceSpy.deleteComment)
      .toHaveBeenCalledWith(1);

    expect(component.comments.length)
      .toBe(1);

    expect(component.comments[0].id)
      .toBe(2);
  });

  it('no deberia eliminar comentario si cancelan confirmacion OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteComment(1);

    expect(routesServiceSpy.deleteComment)
      .not.toHaveBeenCalled();
  });

  it('deberia volver atras correctamente OK', () => {

    component.goBack();

    expect(locationSpy.back)
      .toHaveBeenCalled();
  });

});
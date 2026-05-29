import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    authServiceSpy = {
      login: vi.fn(),
      setUser: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('componente login OK', () => {

    expect(component).toBeTruthy();

  });

  it('deberia iniciar sesion correctamente OK', () => {

    const mockResponse = {
      id: 1,
      username: 'admin'
    };

    component.username = 'admin';
    component.password = '1234';

    authServiceSpy.login.mockReturnValue(
      of(mockResponse)
    );

    component.login();

    expect(authServiceSpy.login)
      .toHaveBeenCalledWith('admin', '1234');

    expect(authServiceSpy.setUser)
      .toHaveBeenCalledWith(mockResponse);

    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(['/welcome']);

  });

  it('deberia mostrar alerta si falla el login OK', () => {

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {});

    authServiceSpy.login.mockReturnValue(
      throwError(() => new Error('Login error'))
    );

    component.login();

    expect(window.alert)
      .toHaveBeenCalledWith('Login incorrecto');

  });

});
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

import { AuthService } from '../../../core/services/auth.service';

import { Router } from '@angular/router';

import { of, throwError } from 'rxjs';

import { vi } from 'vitest';

describe('RegisterComponent', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    authServiceSpy = {
      register: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('componente register OK', () => {

    expect(component).toBeTruthy();

  });

  it('deberia registrar usuario correctamente OK', () => {

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {});

    authServiceSpy.register.mockReturnValue(
      of({})
    );

    component.form.setValue({
      username: 'admin',
      email: 'admin@test.com',
      password: '1234',
      confirmPassword: '1234'
    });

    component.submit();

    expect(authServiceSpy.register)
      .toHaveBeenCalledWith({
        username: 'admin',
        email: 'admin@test.com',
        password: '1234'
      });

    expect(window.alert)
      .toHaveBeenCalledWith('Usuario creado correctamente');

    expect(routerSpy.navigate)
      .toHaveBeenCalledWith(['/login']);

  });

  it('deberia mostrar alerta si las contraseñas no coinciden OK', () => {

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {});

    component.form.setValue({
      username: 'admin',
      email: 'admin@test.com',
      password: '1234',
      confirmPassword: '9999'
    });

    component.submit();

    expect(window.alert)
      .toHaveBeenCalledWith('Las contraseñas no coinciden');

    expect(authServiceSpy.register)
      .not.toHaveBeenCalled();

  });

  it('deberia mostrar alerta si falla el registro OK', () => {

    vi.spyOn(window, 'alert')
      .mockImplementation(() => {});

    authServiceSpy.register.mockReturnValue(
      throwError(() => new Error('Register error'))
    );

    component.form.setValue({
      username: 'admin',
      email: 'admin@test.com',
      password: '1234',
      confirmPassword: '1234'
    });

    component.submit();

    expect(window.alert)
      .toHaveBeenCalledWith('Error al registrar usuario');

  });

});
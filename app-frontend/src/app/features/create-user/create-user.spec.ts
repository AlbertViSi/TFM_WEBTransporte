import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { CreateUserComponent } from './create-user.component';
import { UserService } from '../../core/services/user.service';
import { vi } from 'vitest';

describe('CreateUserComponent', () => {

  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  let userServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {

    userServiceSpy = {
      createUser: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CreateUserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();
  });

  it('no deberia crear usuario si faltan campos OK', () => {

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.username = '';
    component.email = '';
    component.password = '';
    component.role = '';

    component.createUser();

    expect(alertSpy).toHaveBeenCalledWith(
      'Todos los campos son obligatorios'
    );

    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
  });

  it('deberia crear usuario correctamente OK', () => {

    userServiceSpy.createUser.mockReturnValue(of({}));

    component.username = 'admin';
    component.email = 'admin@test.com';
    component.password = '1234';
    component.role = 'ADMIN';

    component.createUser();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith({
      username: 'admin',
      email: 'admin@test.com',
      password: '1234',
      role: 'ADMIN'
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/adminusuarios'
    ]);
  });

});
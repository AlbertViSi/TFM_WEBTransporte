import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { UserComponent } from './admin-users.component';
import { UserService } from '../../core/services/user.service';
import { vi } from 'vitest';

describe('UserComponent', () => {

  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  let userServiceSpy: any;
  let routerSpy: any;

  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@test.com',
      role_id: 1,
      active: true
    },
    {
      id: 2,
      username: 'usuario',
      email: 'user@test.com',
      role_id: 2,
      active: false
    }
  ];

  beforeEach(async () => {

    userServiceSpy = {
      getUsers: vi.fn().mockReturnValue(of(mockUsers)),
      deleteUser: vi.fn().mockReturnValue(of({})),
      reactivateUser: vi.fn().mockReturnValue(of({}))
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deberia crear el componente OK', () => {

    expect(component).toBeTruthy();
  });

  it('deberia cargar usuarios correctamente OK', () => {

    component.loadUsers();

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('deberia filtrar usuarios por username OK', () => {

    component.users = mockUsers;
    component.search = 'admin';

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].username).toBe('admin');
  });

  it('deberia eliminar usuario correctamente OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const loadSpy = vi.spyOn(component, 'loadUsers');

    component.deleteUser(1);

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(loadSpy).toHaveBeenCalled();
  });

  it('no deberia eliminar usuario si cancelan confirmacion OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteUser(1);

    expect(userServiceSpy.deleteUser).not.toHaveBeenCalled();
  });

  it('deberia desactivar usuario activo OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const loadSpy = vi.spyOn(component, 'loadUsers');

    component.toggleUser(mockUsers[0]);

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(loadSpy).toHaveBeenCalled();
  });

  it('deberia reactivar usuario inactivo OK', () => {

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const loadSpy = vi.spyOn(component, 'loadUsers');

    component.toggleUser(mockUsers[1]);

    expect(userServiceSpy.reactivateUser).toHaveBeenCalledWith(2);
    expect(loadSpy).toHaveBeenCalled();
  });

  it('deberia devolver nombre correcto del rol OK', () => {

    expect(component.getRoleName(1)).toBe('Admin');
    expect(component.getRoleName(2)).toBe('Usuario');
    expect(component.getRoleName(3)).toBe('Moderador');
    expect(component.getRoleName(4)).toBe('Node Builder');
    expect(component.getRoleName(999)).toBe('Desconocido');
  });

  it('deberia navegar a crear usuario OK', () => {

    component.goToCreateUser();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/adminusuarios/create'
    ]);
  });

});
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBansComponent } from './admin-bans.component';

describe('AdminBansComponent', () => {
  let component: AdminBansComponent;
  let fixture: ComponentFixture<AdminBansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBansComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBansComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

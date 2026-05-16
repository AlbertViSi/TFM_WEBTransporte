import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutenodesComponent } from './routenodes.component';

describe('RoutenodesComponent', () => {
  let component: RoutenodesComponent;
  let fixture: ComponentFixture<RoutenodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutenodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutenodesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateRouteComponent } from './rate-route.component';

describe('RateRouteComponent', () => {
  let component: RateRouteComponent;
  let fixture: ComponentFixture<RateRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RateRouteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

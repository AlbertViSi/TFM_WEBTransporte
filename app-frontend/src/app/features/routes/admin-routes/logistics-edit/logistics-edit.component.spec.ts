import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsEditComponent } from './logistics-edit.component';

describe('LogisticsEditComponent', () => {
  let component: LogisticsEditComponent;
  let fixture: ComponentFixture<LogisticsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogisticsEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogisticsEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

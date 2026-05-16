import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllnodesComponent } from './allnodes.component';

describe('AllnodesComponent', () => {
  let component: AllnodesComponent;
  let fixture: ComponentFixture<AllnodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllnodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllnodesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

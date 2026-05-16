import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignSubnodeComponent } from './reassign-subnode.component';

describe('ReassignSubnodeComponent', () => {
  let component: ReassignSubnodeComponent;
  let fixture: ComponentFixture<ReassignSubnodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReassignSubnodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReassignSubnodeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

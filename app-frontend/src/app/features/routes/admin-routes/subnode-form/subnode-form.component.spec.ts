import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnodeFormComponent } from './subnode-form.component';

describe('SubnodeCreationComponent', () => {
  let component: SubnodeFormComponent;
  let fixture: ComponentFixture<SubnodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubnodeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubnodeFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubnodeComponent } from './delete-subnode.component';

describe('DeleteSubnodeComponent', () => {
  let component: DeleteSubnodeComponent;
  let fixture: ComponentFixture<DeleteSubnodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSubnodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSubnodeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

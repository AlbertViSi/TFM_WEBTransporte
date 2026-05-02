import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutofillComponentComponent } from './autofill.component';

describe('AutofillComponentComponent', () => {
  let component: AutofillComponentComponent;
  let fixture: ComponentFixture<AutofillComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AutofillComponentComponent],
      imports: [MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutofillComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

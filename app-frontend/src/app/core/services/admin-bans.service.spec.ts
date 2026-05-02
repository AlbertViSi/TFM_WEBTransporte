import { TestBed } from '@angular/core/testing';

import { AdminBansService } from './admin-bans.service';

describe('AdminBansService', () => {
  let service: AdminBansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminBansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

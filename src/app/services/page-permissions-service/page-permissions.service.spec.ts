import { TestBed } from '@angular/core/testing';

import { PagePermissionsService } from './page-permissions.service';

describe('PagePermissionsService', () => {
  let service: PagePermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagePermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

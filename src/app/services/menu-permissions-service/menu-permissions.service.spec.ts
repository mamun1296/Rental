import { TestBed } from '@angular/core/testing';

import { MenuPermissionsService } from './menu-permissions.service';

describe('MenuPermissionsService', () => {
  let service: MenuPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

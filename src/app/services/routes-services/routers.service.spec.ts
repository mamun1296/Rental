import { TestBed } from '@angular/core/testing';

import { RoutersService } from './routers.service';

describe('RoutersService', () => {
  let service: RoutersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

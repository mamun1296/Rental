import { TestBed } from '@angular/core/testing';

import { ItemResponsiveService } from './item-responsive.service';

describe('ItemResponsiveService', () => {
  let service: ItemResponsiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemResponsiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

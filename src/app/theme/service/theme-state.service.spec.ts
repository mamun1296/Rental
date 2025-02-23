import { TestBed } from '@angular/core/testing';

import { ThemeStateService } from './theme-state.service';

describe('ThemeStateService', () => {
  let service: ThemeStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

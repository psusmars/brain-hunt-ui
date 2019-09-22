import { TestBed } from '@angular/core/testing';

import { BrainHuntApiService } from './brain-hunt-api.service';

describe('BrainHuntApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrainHuntApiService = TestBed.get(BrainHuntApiService);
    expect(service).toBeTruthy();
  });
});

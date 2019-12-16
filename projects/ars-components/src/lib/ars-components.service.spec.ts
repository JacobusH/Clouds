import { TestBed } from '@angular/core/testing';

import { ArsComponentsService } from './ars-components.service';

describe('ArsComponentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArsComponentsService = TestBed.get(ArsComponentsService);
    expect(service).toBeTruthy();
  });
});

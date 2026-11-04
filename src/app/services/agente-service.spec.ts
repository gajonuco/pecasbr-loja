import { TestBed } from '@angular/core/testing';

import { AgenteService } from './agente-service';

describe('AgenteService', () => {
  let service: AgenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

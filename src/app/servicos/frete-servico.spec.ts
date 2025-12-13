import { TestBed } from '@angular/core/testing';

import { FreteService } from './frete-servico';

describe('FreteServico', () => {
  let service: FreteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

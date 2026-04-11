import { TestBed } from '@angular/core/testing';

import { IntegracaoAsaas } from './integracao-asaas';

describe('IntegracaoAsaas', () => {
  let service: IntegracaoAsaas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegracaoAsaas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

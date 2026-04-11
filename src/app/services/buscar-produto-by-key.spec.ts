import { TestBed } from '@angular/core/testing';

import { BuscarProdutoByKey } from './buscar-produto-by-key';

describe('BuscarProdutoByKey', () => {
  let service: BuscarProdutoByKey;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarProdutoByKey);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

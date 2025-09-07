import { TestBed } from '@angular/core/testing';

import { CategoriaPeca } from './categoria-peca';

describe('CategoriaPeca', () => {
  let service: CategoriaPeca;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaPeca);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

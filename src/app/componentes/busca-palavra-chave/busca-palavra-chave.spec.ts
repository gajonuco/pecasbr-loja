import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaPalavraChave } from './busca-palavra-chave';

describe('BuscaPalavraChave', () => {
  let component: BuscaPalavraChave;
  let fixture: ComponentFixture<BuscaPalavraChave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaPalavraChave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscaPalavraChave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

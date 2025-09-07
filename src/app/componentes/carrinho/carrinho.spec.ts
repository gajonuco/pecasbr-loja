import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carrinho } from './carrinho';

describe('Carrinho', () => {
  let component: Carrinho;
  let fixture: ComponentFixture<Carrinho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carrinho]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carrinho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

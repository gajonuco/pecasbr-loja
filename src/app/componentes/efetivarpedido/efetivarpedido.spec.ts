import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Efetivarpedido } from './efetivarpedido';

describe('Efetivarpedido', () => {
  let component: Efetivarpedido;
  let fixture: ComponentFixture<Efetivarpedido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Efetivarpedido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Efetivarpedido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

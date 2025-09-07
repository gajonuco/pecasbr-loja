import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recibo } from './recibo';

describe('Recibo', () => {
  let component: Recibo;
  let fixture: ComponentFixture<Recibo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recibo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recibo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

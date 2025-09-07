import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buscacategoria } from './buscacategoria';

describe('Buscacategoria', () => {
  let component: Buscacategoria;
  let fixture: ComponentFixture<Buscacategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buscacategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Buscacategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

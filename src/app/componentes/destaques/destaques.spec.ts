import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Destaques } from './destaques';

describe('Destaques', () => {
  let component: Destaques;
  let fixture: ComponentFixture<Destaques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Destaques]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Destaques);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

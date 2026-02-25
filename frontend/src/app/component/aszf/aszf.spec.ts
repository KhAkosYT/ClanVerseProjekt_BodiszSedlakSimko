import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aszf } from './aszf';

describe('Aszf', () => {
  let component: Aszf;
  let fixture: ComponentFixture<Aszf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aszf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aszf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

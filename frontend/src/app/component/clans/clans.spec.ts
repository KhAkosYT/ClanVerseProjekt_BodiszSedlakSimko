import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clans } from './clans';

describe('Clans', () => {
  let component: Clans;
  let fixture: ComponentFixture<Clans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

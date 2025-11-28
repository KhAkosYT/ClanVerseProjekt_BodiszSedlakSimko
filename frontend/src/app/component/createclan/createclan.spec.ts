import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createclan } from './createclan';

describe('Createclan', () => {
  let component: Createclan;
  let fixture: ComponentFixture<Createclan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createclan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createclan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightCalculatorComponent } from './weight-calculator.component';

describe('WeightCalculatorComponent', () => {
  let component: WeightCalculatorComponent;
  let fixture: ComponentFixture<WeightCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeightCalculatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeightCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

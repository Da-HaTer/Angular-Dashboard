import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutchartComponent } from './doughnutchart.component';

describe('DoughnutchartComponent', () => {
  let component: DoughnutchartComponent;
  let fixture: ComponentFixture<DoughnutchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoughnutchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoughnutchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

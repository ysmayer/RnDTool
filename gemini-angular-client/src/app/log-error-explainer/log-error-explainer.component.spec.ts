import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogErrorExplainerComponent } from './log-error-explainer.component';

describe('LogErrorExplainerComponent', () => {
  let component: LogErrorExplainerComponent;
  let fixture: ComponentFixture<LogErrorExplainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogErrorExplainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogErrorExplainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

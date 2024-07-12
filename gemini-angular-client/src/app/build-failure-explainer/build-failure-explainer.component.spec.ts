import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildFailureExplainerComponent } from './build-failure-explainer.component';

describe('BuildFailureExplainerComponent', () => {
  let component: BuildFailureExplainerComponent;
  let fixture: ComponentFixture<BuildFailureExplainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildFailureExplainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildFailureExplainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

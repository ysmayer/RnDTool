import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedTextareaComponent } from './formatted-textarea.component';

describe('FormattedTextareaComponent', () => {
  let component: FormattedTextareaComponent;
  let fixture: ComponentFixture<FormattedTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormattedTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

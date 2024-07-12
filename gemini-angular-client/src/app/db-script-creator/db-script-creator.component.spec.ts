import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbScriptCreatorComponent } from './db-script-creator.component';

describe('DbScriptCreatorComponent', () => {
  let component: DbScriptCreatorComponent;
  let fixture: ComponentFixture<DbScriptCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbScriptCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbScriptCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

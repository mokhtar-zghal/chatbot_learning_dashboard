import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentAddEditComponent } from './intent-add-edit.component';

describe('EmpAddEditComponent', () => {
  let component: IntentAddEditComponent;
  let fixture: ComponentFixture<IntentAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntentAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntentAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

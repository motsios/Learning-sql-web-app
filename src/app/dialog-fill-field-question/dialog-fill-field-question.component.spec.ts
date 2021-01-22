import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFillFieldQuestionComponent } from './dialog-fill-field-question.component';

describe('DialogFillFieldQuestionComponent', () => {
  let component: DialogFillFieldQuestionComponent;
  let fixture: ComponentFixture<DialogFillFieldQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogFillFieldQuestionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFillFieldQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

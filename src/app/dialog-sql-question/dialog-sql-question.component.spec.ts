import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSqlQuestionComponent } from './dialog-sql-question.component';

describe('DialogSqlQuestionComponent', () => {
  let component: DialogSqlQuestionComponent;
  let fixture: ComponentFixture<DialogSqlQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSqlQuestionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSqlQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

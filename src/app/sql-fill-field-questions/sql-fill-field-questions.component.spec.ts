import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlFillFieldQuestionsComponent } from './sql-fill-field-questions.component';

describe('SqlFillFieldQuestionsComponent', () => {
  let component: SqlFillFieldQuestionsComponent;
  let fixture: ComponentFixture<SqlFillFieldQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SqlFillFieldQuestionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlFillFieldQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

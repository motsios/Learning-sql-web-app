import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlQuizComponent } from './sql-quiz.component';

describe('SqlQuizComponent', () => {
  let component: SqlQuizComponent;
  let fixture: ComponentFixture<SqlQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SqlQuizComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

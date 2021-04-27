import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSqlQueryTrueOrFalseTableComponent } from './dialog-sql-query-true-or-false-table.component';

describe('DialogSqlQueryTrueOrFalseTableComponent', () => {
  let component: DialogSqlQueryTrueOrFalseTableComponent;
  let fixture: ComponentFixture<DialogSqlQueryTrueOrFalseTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSqlQueryTrueOrFalseTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSqlQueryTrueOrFalseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

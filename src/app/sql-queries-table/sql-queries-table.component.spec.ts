import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlQueriesTableComponent } from './sql-queries-table.component';

describe('SqlQueriesTableComponent', () => {
  let component: SqlQueriesTableComponent;
  let fixture: ComponentFixture<SqlQueriesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SqlQueriesTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlQueriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

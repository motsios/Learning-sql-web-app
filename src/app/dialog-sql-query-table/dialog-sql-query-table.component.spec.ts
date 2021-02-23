import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSqlQueryTableComponent } from './dialog-sql-query-table.component';

describe('DialogSqlQueryTableComponent', () => {
  let component: DialogSqlQueryTableComponent;
  let fixture: ComponentFixture<DialogSqlQueryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSqlQueryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSqlQueryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

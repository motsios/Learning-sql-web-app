import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddSqlQueryComponent } from './dialog-add-sql-query.component';

describe('DialogAddSqlQueryComponent', () => {
  let component: DialogAddSqlQueryComponent;
  let fixture: ComponentFixture<DialogAddSqlQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddSqlQueryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddSqlQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

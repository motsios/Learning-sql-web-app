import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsToTablesComponent } from './questions-to-tables.component';

describe('QuestionsToTablesComponent', () => {
  let component: QuestionsToTablesComponent;
  let fixture: ComponentFixture<QuestionsToTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsToTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsToTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

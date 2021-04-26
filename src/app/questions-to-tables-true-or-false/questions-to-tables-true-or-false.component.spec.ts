import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsToTablesTrueOrFalseComponent } from './questions-to-tables-true-or-false.component';

describe('QuestionsToTablesTrueOrFalseComponent', () => {
  let component: QuestionsToTablesTrueOrFalseComponent;
  let fixture: ComponentFixture<QuestionsToTablesTrueOrFalseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsToTablesTrueOrFalseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsToTablesTrueOrFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleFillFieldQuestionsComponent } from './handle-fill-field-questions.component';

describe('HandleFillFieldQuestionsComponent', () => {
  let component: HandleFillFieldQuestionsComponent;
  let fixture: ComponentFixture<HandleFillFieldQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HandleFillFieldQuestionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleFillFieldQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

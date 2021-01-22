import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowQueryResultsComponent } from './dialog-show-query-results.component';

describe('DialogShowQueryResultsComponent', () => {
  let component: DialogShowQueryResultsComponent;
  let fixture: ComponentFixture<DialogShowQueryResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogShowQueryResultsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShowQueryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

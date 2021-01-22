import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllstudentsprofilesComponent } from './allstudentsprofiles.component';

describe('AllstudentsprofilesComponent', () => {
  let component: AllstudentsprofilesComponent;
  let fixture: ComponentFixture<AllstudentsprofilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllstudentsprofilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllstudentsprofilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

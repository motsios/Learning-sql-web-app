import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyprofilepageComponent } from './myprofilepage.component';

describe('MyprofilepageComponent', () => {
  let component: MyprofilepageComponent;
  let fixture: ComponentFixture<MyprofilepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyprofilepageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyprofilepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheorySqlComponent } from './theory-sql.component';

describe('TheorySqlComponent', () => {
  let component: TheorySqlComponent;
  let fixture: ComponentFixture<TheorySqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheorySqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheorySqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExistingSchemaComponent } from './edit-existing-schema.component';

describe('EditExistingSchemaComponent', () => {
  let component: EditExistingSchemaComponent;
  let fixture: ComponentFixture<EditExistingSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditExistingSchemaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExistingSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

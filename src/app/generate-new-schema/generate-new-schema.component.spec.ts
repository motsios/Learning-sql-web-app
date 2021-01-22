import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateNewSchemaComponent } from './generate-new-schema.component';

describe('GenerateNewSchemaComponent', () => {
  let component: GenerateNewSchemaComponent;
  let fixture: ComponentFixture<GenerateNewSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateNewSchemaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateNewSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

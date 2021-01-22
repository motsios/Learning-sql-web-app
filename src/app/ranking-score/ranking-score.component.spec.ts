import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingScoreComponent } from './ranking-score.component';

describe('RankingScoreComponent', () => {
  let component: RankingScoreComponent;
  let fixture: ComponentFixture<RankingScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

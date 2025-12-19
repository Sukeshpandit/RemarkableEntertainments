import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceNarrativeComponent } from './experience-narrative.component';

describe('ExperienceNarrativeComponent', () => {
  let component: ExperienceNarrativeComponent;
  let fixture: ComponentFixture<ExperienceNarrativeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceNarrativeComponent]
    });
    fixture = TestBed.createComponent(ExperienceNarrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

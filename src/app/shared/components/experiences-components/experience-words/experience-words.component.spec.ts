import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceWordsComponent } from './experience-words.component';

describe('ExperienceWordsComponent', () => {
  let component: ExperienceWordsComponent;
  let fixture: ComponentFixture<ExperienceWordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceWordsComponent]
    });
    fixture = TestBed.createComponent(ExperienceWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

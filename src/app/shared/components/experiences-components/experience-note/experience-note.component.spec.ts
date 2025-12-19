import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceNoteComponent } from './experience-note.component';

describe('ExperienceNoteComponent', () => {
  let component: ExperienceNoteComponent;
  let fixture: ComponentFixture<ExperienceNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceNoteComponent]
    });
    fixture = TestBed.createComponent(ExperienceNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

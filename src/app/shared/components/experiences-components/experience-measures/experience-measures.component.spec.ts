import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceMeasuresComponent } from './experience-measures.component';

describe('ExperienceMeasuresComponent', () => {
  let component: ExperienceMeasuresComponent;
  let fixture: ComponentFixture<ExperienceMeasuresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceMeasuresComponent]
    });
    fixture = TestBed.createComponent(ExperienceMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

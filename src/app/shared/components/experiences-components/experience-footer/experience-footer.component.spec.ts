import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceFooterComponent } from './experience-footer.component';

describe('ExperienceFooterComponent', () => {
  let component: ExperienceFooterComponent;
  let fixture: ComponentFixture<ExperienceFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceFooterComponent]
    });
    fixture = TestBed.createComponent(ExperienceFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

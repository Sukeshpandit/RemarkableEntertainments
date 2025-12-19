import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience-note',
  templateUrl: './experience-note.component.html',
  styleUrls: ['./experience-note.component.scss']
})
export class ExperienceNoteComponent implements AfterViewInit, OnDestroy {
  @ViewChild('experienceNoteSection', { static: false }) experienceNoteSection!: ElementRef<HTMLElement>;
  
  private scrollTriggerInstances: ScrollTrigger[] = [];
  private prefersReducedMotion = false;

  ngAfterViewInit(): void {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.prefersReducedMotion) {
      return;
    }

    const sectionEl = this.experienceNoteSection?.nativeElement;
    if (!sectionEl) {
      return;
    }

    // Find elements to animate
    const imageContainer = sectionEl.querySelector('.experience-note__image-container') as HTMLElement;
    const headline = sectionEl.querySelector('.experience-note__headline') as HTMLElement;
    const bodyText = sectionEl.querySelector('.experience-note__body') as HTMLElement;

    if (!imageContainer || !headline || !bodyText) {
      return;
    }

    // Split headline into visual lines
    this.splitHeadlineIntoLines(headline);

    // Get headline lines after splitting
    const headlineLines = Array.from(headline.querySelectorAll('.headline-line')) as HTMLElement[];

    // Set initial states
    gsap.set(imageContainer, { opacity: 0, y: 24 });
    headlineLines.forEach(line => {
      gsap.set(line, { opacity: 0, y: 32 });
    });
    gsap.set(bodyText, { opacity: 0, y: 16 });

    // Calculate body text delay: image delay (0) + headline delay (0.07) + headline animation duration
    const headlineDelay = 0.07;
    const headlineDuration = 0.9;
    const headlineStagger = 0.12;
    const bodyDelay = headlineDelay + headlineDuration + (headlineLines.length - 1) * headlineStagger;

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true,
        markers: false,
        onEnter: () => {
          gsap.set(imageContainer, { willChange: 'transform, opacity' });
          headlineLines.forEach(line => {
            gsap.set(line, { willChange: 'transform, opacity' });
          });
          gsap.set(bodyText, { willChange: 'transform, opacity' });
        }
      },
      onComplete: () => {
        gsap.set(imageContainer, { willChange: 'auto' });
        headlineLines.forEach(line => {
          gsap.set(line, { willChange: 'auto' });
        });
        gsap.set(bodyText, { willChange: 'auto' });
      }
    });

    // Animate image container (starts at 0s)
    tl.to(imageContainer, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out'
    }, 0);

    // Animate headline lines (starts at 0.07s, after image starts)
    if (headlineLines.length > 0) {
      tl.to(headlineLines, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power2.out'
      }, headlineDelay);
    }

    // Animate body text (starts after headline completes)
    tl.to(bodyText, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, bodyDelay);

    // Store ScrollTrigger instance
    if (tl.scrollTrigger) {
      this.scrollTriggerInstances.push(tl.scrollTrigger);
    }
  }

  private splitHeadlineIntoLines(headline: HTMLElement): void {
    const text = headline.textContent || '';
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    headline.innerHTML = lines.map(line => `<span class="headline-line">${line}</span>`).join(' ');
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstances.forEach(instance => {
      instance.kill();
    });
    this.scrollTriggerInstances = [];
  }
}

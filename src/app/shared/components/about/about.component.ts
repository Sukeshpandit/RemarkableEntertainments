import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection', { static: false }) aboutSection!: ElementRef<HTMLElement>;
  
  private scrollTriggerInstances: ScrollTrigger[] = [];
  private prefersReducedMotion = false;

  ngAfterViewInit(): void {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.prefersReducedMotion) {
      return;
    }

    const sectionEl = this.aboutSection?.nativeElement;
    if (!sectionEl) {
      return;
    }

    // Find elements to animate
    const eyebrow = sectionEl.querySelector('.about-eyebrow, small, .eyebrow, [class*="label"]') as HTMLElement;
    const heading = sectionEl.querySelector('.about-heading, h1, h2, h3, .heading, [class*="heading"]') as HTMLElement;
    const paragraphs = Array.from(sectionEl.querySelectorAll('.about-text, p')) as HTMLElement[];

    // Set initial states
    if (eyebrow) {
      gsap.set(eyebrow, { opacity: 0, y: 16 });
    }
    if (heading) {
      gsap.set(heading, { opacity: 0, y: 24 });
    }
    paragraphs.forEach(p => {
      gsap.set(p, { opacity: 0, y: 24 });
    });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 75%',
        toggleActions: 'play none none none',
        once: true,
        markers: false,
        onEnter: () => {
          if (eyebrow) gsap.set(eyebrow, { willChange: 'transform, opacity' });
          if (heading) gsap.set(heading, { willChange: 'transform, opacity' });
          paragraphs.forEach(p => gsap.set(p, { willChange: 'transform, opacity' }));
        }
      },
      onComplete: () => {
        if (eyebrow) gsap.set(eyebrow, { willChange: 'auto' });
        if (heading) gsap.set(heading, { willChange: 'auto' });
        paragraphs.forEach(p => gsap.set(p, { willChange: 'auto' }));
      }
    });

    // Animate eyebrow
    if (eyebrow) {
      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }

    // Animate heading
    if (heading) {
      tl.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, eyebrow ? 0.1 : 0);
    }

    // Animate paragraphs
    if (paragraphs.length > 0) {
      tl.to(paragraphs, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out'
      }, heading ? 0.2 : (eyebrow ? 0.3 : 0));
    }

    // Store ScrollTrigger instance for content reveal
    if (tl.scrollTrigger) {
      this.scrollTriggerInstances.push(tl.scrollTrigger);
    }

    // PART 2: Subtle background-only parallax
    const blobsContainer = sectionEl.querySelector('.about__blobs') as HTMLElement;
    if (blobsContainer) {
      const parallaxTrigger = gsap.to(blobsContainer, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          markers: false
        }
      });

      if (parallaxTrigger.scrollTrigger) {
        this.scrollTriggerInstances.push(parallaxTrigger.scrollTrigger);
      }
    }
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstances.forEach(instance => {
      instance.kill();
    });
    this.scrollTriggerInstances = [];
  }
}

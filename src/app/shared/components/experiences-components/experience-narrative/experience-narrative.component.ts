import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NARRATIVE_CARDS, NarrativeCard } from './narrative-section.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience-narrative',
  templateUrl: './experience-narrative.component.html',
  styleUrls: ['./experience-narrative.component.scss']
})
export class ExperienceNarrativeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('narrativeSection', { static: false }) narrativeSection!: ElementRef<HTMLElement>;
  @ViewChild('leftColumn', { static: false }) leftColumn!: ElementRef<HTMLElement>;
  @ViewChild('cardsContainer', { static: false }) cardsContainer!: ElementRef<HTMLElement>;

  narrativeCards: NarrativeCard[] = NARRATIVE_CARDS;
  currentCardIndex: number = 0;

  private scrollTriggerInstances: ScrollTrigger[] = [];
  private prefersReducedMotion = false;

  ngAfterViewInit(): void {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sectionEl = this.narrativeSection?.nativeElement;
    if (!sectionEl) {
      return;
    }

    // Initialize first left section as visible
    const leftSections = Array.from(sectionEl.querySelectorAll('.experience-narrative__left-section')) as HTMLElement[];
    if (leftSections[0]) {
      gsap.set(leftSections[0], { opacity: 1 });
    }

    // Setup card animations and section transitions
    this.setupCardAnimations();
  }

  private setupCardAnimations(): void {
    const sectionEl = this.narrativeSection?.nativeElement;
    if (!sectionEl) {
      return;
    }

    const cards = Array.from(sectionEl.querySelectorAll('.experience-narrative__card')) as HTMLElement[];

    cards.forEach((card, index) => {
      // Set initial state for animation
      if (!this.prefersReducedMotion) {
        gsap.set(card, { opacity: 0, y: 16 });
      } else {
        // Show immediately if reduced motion
        gsap.set(card, { opacity: 1, y: 0 });
      }

      // Create animation with ScrollTrigger that handles both fade-in and section transitions
      if (!this.prefersReducedMotion) {
        const animation = gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true, // Only animate once on first enter
            onEnter: () => {
              this.handleCardEnter(index);
            },
            onEnterBack: () => {
              this.handleCardEnter(index);
            },
            markers: false
          }
        });

        // Store the ScrollTrigger instance
        if (animation.scrollTrigger) {
          this.scrollTriggerInstances.push(animation.scrollTrigger);
        }
      } else {
        // For reduced motion, just create a ScrollTrigger for section transitions
        const scrollTrigger = ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          onEnter: () => {
            this.handleCardEnter(index);
          },
          onEnterBack: () => {
            this.handleCardEnter(index);
          },
          once: false,
          markers: false
        });
        this.scrollTriggerInstances.push(scrollTrigger);
      }
    });
  }

  private handleCardEnter(cardIndex: number): void {
    if (cardIndex !== this.currentCardIndex) {
      this.updateLeftColumnContent(cardIndex);
    }
  }

  private updateLeftColumnContent(cardIndex: number): void {
    const sectionEl = this.narrativeSection?.nativeElement;
    if (!sectionEl) {
      return;
    }

    const leftSections = Array.from(sectionEl.querySelectorAll('.experience-narrative__left-section')) as HTMLElement[];
    const oldSection = leftSections[this.currentCardIndex];
    const newSection = leftSections[cardIndex];

    if (!oldSection || !newSection) {
      this.currentCardIndex = cardIndex;
      return;
    }

    if (this.prefersReducedMotion) {
      // No animation, just update index
      this.currentCardIndex = cardIndex;
      return;
    }

    // Fade out old section
    gsap.to(oldSection, {
      opacity: 0.3,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        // Update index
        this.currentCardIndex = cardIndex;
        
        // Fade in new section
        setTimeout(() => {
          gsap.to(newSection, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
          });
        }, 0);
      }
    });
  }

  getHeadlineLines(headline: string): string[] {
    return headline.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0);
  }

  ngOnDestroy(): void {
    this.scrollTriggerInstances.forEach(instance => {
      instance.kill();
    });
    this.scrollTriggerInstances = [];
  }
}

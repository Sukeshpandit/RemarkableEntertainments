import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-transition-overlay',
  templateUrl: './hero-transition-overlay.component.html',
  styleUrls: ['./hero-transition-overlay.component.scss']
})
export class HeroTransitionOverlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('transitionSection', { static: false }) transitionSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('svg1', { static: false }) svg1Ref!: ElementRef<HTMLImageElement>;
  @ViewChild('svg2', { static: false }) svg2Ref!: ElementRef<HTMLImageElement>;
  @ViewChild('svg3', { static: false }) svg3Ref!: ElementRef<HTMLImageElement>;
  @ViewChild('svg4', { static: false }) svg4Ref!: ElementRef<HTMLImageElement>;

  private scrollTriggers: ScrollTrigger[] = [];
  private masterTimeline?: gsap.core.Timeline;
  private prefersReducedMotion: boolean = false;
  private isMobile: boolean = false;

  constructor(private router: Router) {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;
      this.isMobile = window.innerWidth < 768;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  ngAfterViewInit(): void {
    if (this.prefersReducedMotion) {
      // Skip animations for reduced motion preference
      return;
    }

    setTimeout(() => {
      this.initScrollAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    // Kill all ScrollTriggers
    this.scrollTriggers.forEach(st => {
      if (st) {
        st.kill();
      }
    });
    this.scrollTriggers = [];

    // Kill timeline
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }
  }

  private initScrollAnimations(): void {
    const section = this.transitionSectionRef?.nativeElement;
    const svg1 = this.svg1Ref?.nativeElement;
    const svg2 = this.svg2Ref?.nativeElement;
    const svg3 = this.svg3Ref?.nativeElement;
    const svg4 = this.svg4Ref?.nativeElement;

    if (!section || !svg1 || !svg2 || !svg3 || !svg4) {
      return;
    }

    // Get SVG group elements
    const leftGroup = svg1.parentElement;
    const rightGroup = svg3.parentElement;

    if (!leftGroup || !rightGroup) {
      return;
    }

    // Set initial positions for SVG groups (off-screen)
    // Use viewport width for off-screen positioning
    const offScreenDistance = window.innerWidth;
    gsap.set(leftGroup, { x: -offScreenDistance });
    gsap.set(rightGroup, { x: offScreenDistance });

    // Calculate final positions for SVG groups with gap between them
    // Responsive sizing based on viewport width
    const isMobile = window.innerWidth < 768;
    const svgWidth = isMobile ? 60 : 120; // Mobile: 60px (2x smaller), Desktop: 120px
    const gapBetweenSvgs = 0; // Mobile: 1rem (16px), Desktop: 2rem (32px)
    const gapBetweenGroups = isMobile ? 24 : 40; // Mobile: 1.5rem (24px), Desktop: 4rem (64px)
    
    // Each group: 2 SVGs + 1 gap
    const groupWidth = svgWidth * 2 + gapBetweenSvgs;
    
    // Position groups so there's 2rem gap between them at center
    // Left group offset: -(half group width + half gap) = -(136 + 16) = -152px
    // Right group offset: +(half group width + half gap) = +(136 + 16) = 152px
    const leftGroupFinalX = -(groupWidth / 2 + gapBetweenGroups / 2);
    const rightGroupFinalX = groupWidth / 2 + gapBetweenGroups / 2;

    // Create master timeline with ScrollTrigger
    // Animation should start early and complete while section is fully visible
    const scrollDistance = window.innerHeight * 0.6; // 60% of viewport height for animation

    // Set will-change for better performance
    gsap.set([leftGroup, rightGroup], { 
      willChange: 'transform',
      force3D: true 
    });

    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom', // Start when section enters viewport (top hits bottom of viewport)
        end: 'center center', // Complete when section is centered in viewport
        scrub: 1, // Smooth scrubbing with 1 second lag for smoother animation
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Smooth interpolation for SVG groups entry animation
          const svgProgress = progress;
          const leftGroupX = gsap.utils.interpolate(-offScreenDistance, leftGroupFinalX, svgProgress);
          const rightGroupX = gsap.utils.interpolate(offScreenDistance, rightGroupFinalX, svgProgress);

          // Apply smooth animation without velocity enhancement to prevent jitter
          gsap.set(leftGroup, { x: leftGroupX, force3D: true });
          gsap.set(rightGroup, { x: rightGroupX, force3D: true });
        }
      }
    });

    // Create a dummy animation to establish the timeline duration
    // All actual animations are handled in onUpdate callback
    const dummyTarget = { progress: 0 };
    this.masterTimeline.to(dummyTarget, {
      progress: 1,
      duration: 1,
      ease: 'none'
    });

    // Store ScrollTrigger instance
    const scrollTrigger = this.masterTimeline.scrollTrigger;
    if (scrollTrigger) {
      this.scrollTriggers.push(scrollTrigger);
    }
  }
}


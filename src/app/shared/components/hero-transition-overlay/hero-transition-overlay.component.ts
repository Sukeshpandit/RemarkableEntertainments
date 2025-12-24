import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
  private lastScrollTime: number = 0;
  private lastScrollPosition: number = 0;
  private scrollVelocity: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;
      this.isMobile = window.innerWidth < 768;
    }
  }

  ngAfterViewInit(): void {
    if (this.prefersReducedMotion || this.isMobile) {
      // Skip animations, just show static content
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
    gsap.set(leftGroup, { x: -window.innerWidth });
    gsap.set(rightGroup, { x: window.innerWidth });

    // Calculate final positions for SVG groups with gap between them
    // Each SVG is 120px wide, gap between SVGs in group is 2rem (32px)
    // Gap between groups is increased to 4rem (64px) for more space
    const svgWidth = 120; // px
    const gapBetweenSvgs = 32; // 2rem in px
    const gapBetweenGroups = 64; // 4rem in px (increased from 2rem)
    
    // Each group: 2 SVGs + 1 gap = 2*120 + 32 = 272px total width
    const groupWidth = svgWidth * 2 + gapBetweenSvgs; // 272px
    
    // Position groups so there's 2rem gap between them at center
    // Left group offset: -(half group width + half gap) = -(136 + 16) = -152px
    // Right group offset: +(half group width + half gap) = +(136 + 16) = 152px
    const leftGroupFinalX = -(groupWidth / 2 + gapBetweenGroups / 2);
    const rightGroupFinalX = groupWidth / 2 + gapBetweenGroups / 2;

    // Create master timeline with ScrollTrigger
    // Animation should start early and complete while section is fully visible
    const scrollDistance = window.innerHeight * 0.6; // 60% of viewport height for animation

    // Initialize velocity tracking
    this.lastScrollTime = performance.now();
    this.lastScrollPosition = window.scrollY;
    this.scrollVelocity = 0;

    this.masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom', // Start when section enters viewport (top hits bottom of viewport)
        end: 'center center', // Complete when section is centered in viewport
        scrub: true,
        onUpdate: (self) => {
          // Calculate scroll velocity manually
          const currentTime = performance.now();
          const currentScrollPosition = window.scrollY;
          const timeDelta = currentTime - this.lastScrollTime;
          
          if (timeDelta > 0) {
            const positionDelta = currentScrollPosition - this.lastScrollPosition;
            this.scrollVelocity = (positionDelta / timeDelta) * 1000; // pixels per second
            this.lastScrollTime = currentTime;
            this.lastScrollPosition = currentScrollPosition;
          }

          // Clamp velocity and apply enhancement to SVGs only
          const clampedVelocity = Math.max(-500, Math.min(500, this.scrollVelocity));
          const velocityOffset = clampedVelocity * 0.1; // Reduced influence to prevent overlap

          const progress = self.progress;
          
          // SVG groups entry animation (0-100% of scroll) - animate to center
          const svgProgress = progress;
          const leftGroupX = gsap.utils.interpolate(-window.innerWidth, leftGroupFinalX, svgProgress);
          const rightGroupX = gsap.utils.interpolate(window.innerWidth, rightGroupFinalX, svgProgress);

          // Apply base position + velocity enhancement, but clamp to final positions
          // This prevents groups from going beyond their final positions and overlapping
          const leftGroupXWithVelocity = leftGroupX + velocityOffset;
          const rightGroupXWithVelocity = rightGroupX - velocityOffset;
          
          // Clamp positions to never exceed final positions (prevent overlap)
          const clampedLeftX = Math.min(leftGroupXWithVelocity, leftGroupFinalX);
          const clampedRightX = Math.max(rightGroupXWithVelocity, rightGroupFinalX);
          
          gsap.set(leftGroup, { x: clampedLeftX });
          gsap.set(rightGroup, { x: clampedRightX });
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


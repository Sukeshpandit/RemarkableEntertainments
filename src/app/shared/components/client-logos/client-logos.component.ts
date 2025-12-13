import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-client-logos',
  templateUrl: './client-logos.component.html',
  styleUrls: ['./client-logos.component.scss']
})
export class ClientLogosComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rowTop', { static: false }) rowTopRef!: ElementRef<HTMLElement>;
  @ViewChild('rowBottom', { static: false }) rowBottomRef!: ElementRef<HTMLElement>;

  logos: string[] = [
    'assets/images/clients/client1.svg',
    'assets/images/clients/client2.svg',
    'assets/images/clients/client3.svg',
    'assets/images/clients/client4.svg',
    'assets/images/clients/client5.svg',
    'assets/images/clients/client6.svg',
    'assets/images/clients/client7.svg',
    'assets/images/clients/client8.svg',
    'assets/images/clients/client9.svg',
    'assets/images/clients/client10.svg',
    'assets/images/clients/client11.svg',
    'assets/images/clients/client12.svg',
    'assets/images/clients/client13.svg',
    'assets/images/clients/client14.svg',
    'assets/images/clients/client15.svg',
  ];

  private topTimeline?: gsap.core.Timeline;
  private bottomTimeline?: gsap.core.Timeline;
  private intersectionObserver?: IntersectionObserver;
  private isVisible: boolean = true;
  private prefersReducedMotion: boolean = false;
  private readonly STORAGE_KEY = 'client-logos-order';

  constructor() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;
    }
    this.randomizeLogos();
  }

  ngAfterViewInit(): void {
    if (this.prefersReducedMotion) return;

    setTimeout(() => {
      this.initAnimations();
      this.initIntersectionObserver();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.topTimeline) {
      this.topTimeline.kill();
    }
    if (this.bottomTimeline) {
      this.bottomTimeline.kill();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private randomizeLogos(): void {
    const storedOrder = sessionStorage.getItem(this.STORAGE_KEY);
    if (storedOrder) {
      try {
        this.logos = JSON.parse(storedOrder);
        return;
      } catch (e) {
        // Invalid stored data, continue to shuffle
      }
    }

    this.logos = this.fisherYatesShuffle([...this.logos]);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logos));
  }

  private fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private initAnimations(): void {
    const topTrack = this.rowTopRef?.nativeElement;
    const bottomTrack = this.rowBottomRef?.nativeElement;

    if (!topTrack || !bottomTrack) return;

    this.topTimeline = gsap.timeline({ repeat: -1, ease: 'none' });
    this.bottomTimeline = gsap.timeline({ repeat: -1, ease: 'none' });

    this.topTimeline.fromTo(
      topTrack,
      { xPercent: -50 },
      {
        xPercent: 0,
        duration: 90,
        ease: 'none'
      }
    );

    this.bottomTimeline.to(bottomTrack, {
      xPercent: -50,
      duration: 90,
      ease: 'none'
    });

    topTrack.style.willChange = 'transform';
    bottomTrack.style.willChange = 'transform';
  }

  private initIntersectionObserver(): void {
    const element = this.rowTopRef?.nativeElement?.parentElement?.parentElement;
    if (!element) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            this.resumeAnimations();
          } else {
            this.pauseAnimations();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(element);
  }

  private pauseAnimations(): void {
    if (this.topTimeline) this.topTimeline.pause();
    if (this.bottomTimeline) this.bottomTimeline.pause();
  }

  private resumeAnimations(): void {
    if (this.topTimeline) this.topTimeline.resume();
    if (this.bottomTimeline) this.bottomTimeline.resume();
  }
}

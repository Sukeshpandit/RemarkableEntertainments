import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShowcaseCard } from '../experiences-cards/experiences-card.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-showcase-grid',
  templateUrl: './showcase-grid.component.html',
  styleUrls: ['./showcase-grid.component.scss']
})
export class ShowcaseGridComponent implements AfterViewInit, OnDestroy {
  @Input() cards: ShowcaseCard[] = [];
  @ViewChild('grid', { static: true }) gridRef!: ElementRef<HTMLElement>;
  @ViewChild('scrollContainer', { static: true }) scrollContainerRef!: ElementRef<HTMLElement>;

  private scrollTriggers: ScrollTrigger[] = [];
  private hoverHandlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];
  private prefersReducedMotion: boolean = false;
  private isTouchDevice: boolean = false;

  constructor() {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  }

  ngAfterViewInit(): void {
    // Wait for DOM and content to be ready
    setTimeout(() => {
      const gridEl = this.gridRef?.nativeElement;
      if (!gridEl || this.cards.length === 0) return;

      const items: HTMLElement[] = Array.from(gridEl.querySelectorAll('.showcase-grid__item'));
      if (items.length === 0) return;

      // Wait for one more frame to ensure layout is complete
      requestAnimationFrame(() => {
        // Set up scroll-driven stacked card effect
        this.initStackedCardsEffect(items, gridEl);

        // Add hover-tilt only on desktop non-touch devices
        if (!this.isTouchDevice && !this.prefersReducedMotion) {
          this.initHoverTilt(items);
        }

        // Refresh ScrollTrigger after everything is set up
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    }, 200);
  }

  private initStackedCardsEffect(items: HTMLElement[], gridEl: HTMLElement): void {
    const totalCards = items.length;
    if (totalCards === 0) return;

    const scrollContainer = this.scrollContainerRef?.nativeElement;
    if (!scrollContainer) return;

    // Calculate card height - use the actual rendered height
    const firstItem = items[0];
    const firstCard = firstItem.querySelector<HTMLElement>('.showcase-card');
    
    // Get the actual rendered height - ensure we have a valid height
    let cardHeight = 569; // Default fallback
    if (firstCard) {
      const rect = firstCard.getBoundingClientRect();
      const offsetH = firstCard.offsetHeight;
      cardHeight = Math.max(rect.height, offsetH, 569);
    } else if (firstItem) {
      const rect = firstItem.getBoundingClientRect();
      const offsetH = firstItem.offsetHeight;
      cardHeight = Math.max(rect.height, offsetH, 569);
    }
    
    // Set grid container height to exactly match card height
    // This ensures cards behind are not visible from behind
    if (gridEl && cardHeight > 0) {
      gridEl.style.height = `${cardHeight}px`;
      gridEl.style.minHeight = `${cardHeight}px`;
      gridEl.style.maxHeight = `${cardHeight}px`;
    }
    
    // Scroll distance per card transition
    // Reduce scroll distance for faster transitions (50% of card height)
    const scrollDistance = cardHeight * 0.5;
    
    // Calculate total scroll height needed for all card transitions
    const totalScrollHeight = scrollDistance * (totalCards - 1) + cardHeight;
    
    // Set scroll container height to show only one card height (viewport)
    if (scrollContainer) {
      scrollContainer.style.height = `${cardHeight}px`;
    }
    
    // Set scroll content wrapper height to create scrollable area
    const scrollContent = scrollContainer.querySelector('.showcase-grid__scroll-content') as HTMLElement;
    if (scrollContent) {
      scrollContent.style.height = `${totalScrollHeight}px`;
    }

    // Set initial states
    items.forEach((item, index) => {
      const card = item.querySelector<HTMLElement>('.showcase-card');
      if (!card) return;

      if (index === 0) {
        // First card - fully visible on top
        gsap.set(item, {
          y: 0,
          scale: 1,
          opacity: 1,
          zIndex: totalCards
        });
        gsap.set(card, {
          backgroundColor: '#8E6AD1'
        });
      } else {
        // Other cards - start below and scaled down
        const scaleDown = 0.90 - ((index - 1) * 0.02);
        gsap.set(item, {
          y: cardHeight * 0.5,
          scale: scaleDown,
          opacity: 1, // Keep opacity at 1
          zIndex: totalCards - index
        });
        gsap.set(card, {
          backgroundColor: `rgba(142, 106, 209, ${0.6 - ((index - 1) * 0.1)})`
        });
      }
    });

    // Create a single master ScrollTrigger for all cards
    // Total scroll distance needed to transition through all cards
    const totalScrollDistance = scrollDistance * (totalCards - 1);
    
    try {
      const masterST = ScrollTrigger.create({
        trigger: gridEl,
        start: 'top top',
        end: `+=${totalScrollDistance}`,
        scroller: scrollContainer, // Use internal scroll container instead of window
        scrub: this.prefersReducedMotion ? 0 : 1,
        markers: false,
        invalidateOnRefresh: true,
        pin: false, // No pinning needed for internal scroll
        onUpdate: (self) => {
          const globalProgress = self.progress;

          items.forEach((item, index) => {
            const card = item.querySelector<HTMLElement>('.showcase-card');
            if (!card) return;

            if (index === 0) {
              // First card - moves behind as others come up
              const easeProgress = this.easeInOutCubic(globalProgress);
              const scale = 1 - (easeProgress * 0.1);
              const y = easeProgress * cardHeight * 0.15;
              const bgOpacity = 1 - (easeProgress * 0.3);
              
              // Make z-index decrease earlier so next card is visible sooner
              const zIndexProgress = Math.min(1, globalProgress * 1.5); // Multiply to make it change earlier
              const currentZIndex = totalCards - Math.floor(zIndexProgress * (totalCards - 1));

              gsap.set(item, {
                y: y,
                scale: scale,
                opacity: 1, // Keep opacity at 1
                zIndex: currentZIndex
              });
              gsap.set(card, {
                backgroundColor: `rgba(142, 106, 209)`
              });
            } else {
              // Other cards - slide up when their turn comes
              const cardStart = (index - 1) / (totalCards - 1);
              const cardEnd = index / (totalCards - 1);
              // Adjust cardStart to make card visible earlier (subtract a small offset)
              const adjustedCardStart = Math.max(0, cardStart - 0.1);
              const cardProgress = Math.max(0, Math.min(1, (globalProgress - adjustedCardStart) / (cardEnd - adjustedCardStart)));

              if (cardProgress <= 0) {
                // Still below
                const scaleDown = 0.90 - ((index - 1) * 0.02);
                gsap.set(item, {
                  y: cardHeight * 0.5,
                  scale: scaleDown,
                  opacity: 1, // Keep opacity at 1
                  zIndex: totalCards - index
                });
                gsap.set(card, {
                  backgroundColor: `rgba(142, 106, 209, ${0.6 - ((index - 1) * 0.1)})`
                });
              } else if (cardProgress >= 1) {
                // On top
                gsap.set(item, {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  zIndex: totalCards
                });
                gsap.set(card, {
                  backgroundColor: '#8E6AD1'
                });
              } else {
                // Transitioning
                const easeProgress = this.easeInOutCubic(cardProgress);
                const startScale = 0.90 - ((index - 1) * 0.02);
                const startY = cardHeight * 0.5;

                const scale = startScale + (1 - startScale) * easeProgress;
                const y = startY * (1 - easeProgress);
                
                // Make z-index increase earlier so card behind is visible sooner
                // Use raw cardProgress for z-index to make it change earlier
                const zIndexProgress = Math.min(1, cardProgress * 1.5); // Multiply by 1.5 to make it change earlier
                const currentZIndex = totalCards - index + Math.round(zIndexProgress * index);

                gsap.set(item, {
                  y: y,
                  scale: scale,
                  opacity: 1, // Keep opacity at 1
                  zIndex: currentZIndex
                });
                gsap.set(card, {
                  backgroundColor: `rgba(142, 106, 209)`
                });
              }
            }
          });
        }
      });

      this.scrollTriggers.push(masterST);
    } catch (error: any) {
      console.error('Error creating ScrollTrigger:', error);
    }
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private initHoverTilt(items: HTMLElement[]): void {
    items.forEach((item) => {
      const card = item.querySelector<HTMLElement>('.showcase-card');
      if (!card) return;

      const cardEl = card as HTMLElement;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = cardEl.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        const px = (relX / rect.width) - 0.5;
        const py = (relY / rect.height) - 0.5;
        const rotateY = px * 6;
        const rotateX = -py * 6;

        gsap.to(cardEl, {
          rotationY: rotateY,
          rotationX: rotateX,
          x: px * 8,
          y: py * 6,
          duration: 0.32,
          transformPerspective: 900,
          transformOrigin: 'center',
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardEl, {
          rotationY: 0,
          rotationX: 0,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      };

      cardEl.addEventListener('mousemove', handleMouseMove);
      cardEl.addEventListener('mouseleave', handleMouseLeave);
      this.hoverHandlers.push({ el: cardEl, move: handleMouseMove, leave: handleMouseLeave });
    });
  }

  ngOnDestroy(): void {
    // Clean up scroll triggers
    this.scrollTriggers.forEach(st => st.kill());
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars?.trigger === this.gridRef?.nativeElement) {
        st.kill();
      }
    });

    // Clean up hover handlers
    this.hoverHandlers.forEach(h => {
      try {
        h.el.removeEventListener('mousemove', h.move);
        h.el.removeEventListener('mouseleave', h.leave);
        gsap.set(h.el, { rotationY: 0, rotationX: 0, x: 0, y: 0 });
      } catch (err) {
        // Ignore errors during cleanup
      }
    });
  }

  // Video handlers (unchanged)
  toggleVideo(video: HTMLVideoElement, overlay: HTMLElement): void {
    if (video.paused) {
      video.play().then(() => {
        overlay.classList.add('hidden');
      }).catch(() => {
        overlay.classList.remove('hidden');
      });
    } else {
      video.pause();
      overlay.classList.remove('hidden');
    }
  }

  onVideoLoaded(video: HTMLVideoElement, overlay: HTMLElement): void {
    video.play().then(() => {
      overlay.classList.add('hidden');
    }).catch(() => {
      overlay.classList.remove('hidden');
    });

    if (!video.paused) {
      overlay.classList.add('hidden');
    }
  }

  onVideoPlay(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const overlay = video.parentElement?.querySelector('.showcase-card__play-overlay') as HTMLElement;
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  onVideoPause(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const overlay = video.parentElement?.querySelector('.showcase-card__play-overlay') as HTMLElement;
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }
}

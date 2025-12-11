import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SHOWCASE_CARDS, ShowcaseCard } from './showcase-card.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-showcase-card',
  templateUrl: './showcase-card.component.html',
  styleUrls: ['./showcase-card.component.scss']
})
export class ShowcaseCardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('title') title!: ElementRef<HTMLElement>;
  @ViewChild('subtitle') subtitle!: ElementRef<HTMLElement>;
  @ViewChild('primaryBtn') primaryBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('blobs') blobs!: ElementRef<HTMLElement>;
  
  showcaseCards: ShowcaseCard[] = SHOWCASE_CARDS;
  private tl?: gsap.core.Timeline;
  private scrollTriggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    // Use the hero element as the trigger point
    const heroEl = document.querySelector('app-hero') as HTMLElement | null;
    const triggerTarget = heroEl ?? this.title.nativeElement;

    // Split title into words for animation BEFORE creating timeline
    if (this.title?.nativeElement) {
      const titleText = this.title.nativeElement.textContent || '';
      const words = titleText.split(' ');
      this.title.nativeElement.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    }

    // timeline for stagger reveal
    this.tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: triggerTarget,
        start: heroEl ? 'bottom top+=80' : 'top 80%',
        // when the hero's bottom crosses near top of viewport -> reveal marketing block
        onEnter: () => { /* optional callback */ },
        // allow replay on re-enter if you like:
        toggleActions: 'play none none reverse'
      }
    });

    const titleWords = this.title.nativeElement.querySelectorAll('.word');
    if (titleWords.length > 0) {
      this.tl
        .from(titleWords, { y: 36, opacity: 0, stagger: 0.06, duration: 0.7 })
        .from(this.subtitle.nativeElement, { y: 18, opacity: 0, duration: 0.5 }, '-=0.4')
        .from(this.primaryBtn.nativeElement, { scale: 0.98, opacity: 0, duration: 0.45 }, '-=0.35');
    } else {
      // Fallback if words weren't found
      this.tl
        .from(this.title.nativeElement, { y: 36, opacity: 0, duration: 0.7 })
        .from(this.subtitle.nativeElement, { y: 18, opacity: 0, duration: 0.5 }, '-=0.4')
        .from(this.primaryBtn.nativeElement, { scale: 0.98, opacity: 0, duration: 0.45 }, '-=0.35');
    }

    // Parallax for blobs (subtle)
    if (this.blobs?.nativeElement) {
      const blobAnimation = gsap.to(this.blobs.nativeElement.querySelectorAll('.blob'), {
        y: (i: number) => i % 2 === 0 ? -40 : 40,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerTarget,
          start: heroEl ? 'bottom top' : 'top top',
          end: '+=400',
          scrub: 0.6
        }
      });
      // Store blob animation's scrollTrigger for cleanup
      const blobST = (blobAnimation as any).scrollTrigger;
      if (blobST) this.scrollTriggers.push(blobST);
    }
    
    // Store timeline's scrollTrigger for cleanup
    const timelineST = this.tl?.scrollTrigger;
    if (timelineST) this.scrollTriggers.push(timelineST);

    // Magnetic CTA (existing logic) – keep but ensure it is present and cleaned up in ngOnDestroy
    const btnEl = this.primaryBtn?.nativeElement;
    if (btnEl) {
      const move = (e: MouseEvent) => {
        const rect = btnEl.getBoundingClientRect();
        const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        gsap.to(btnEl, { x: offsetX, y: offsetY, duration: 0.22, ease: 'power3.out' });
      };
      const leave = () => gsap.to(btnEl, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' });
      btnEl.addEventListener('mousemove', move);
      btnEl.addEventListener('mouseleave', leave);

      // store for cleanup
      (this as any).__btnHandlers = { move, leave, btnEl };
    }
  }

  ngOnDestroy(): void {
    if (this.tl) this.tl.kill();
    // Clean up only this component's ScrollTriggers
    this.scrollTriggers.forEach(st => st.kill());
    const h = (this as any).__btnHandlers;
    if (h?.btnEl) {
      h.btnEl.removeEventListener('mousemove', h.move);
      h.btnEl.removeEventListener('mouseleave', h.leave);
      gsap.set(h.btnEl, { x: 0, y: 0 });
    }
  }
}


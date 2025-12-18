import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-experience-words',
  templateUrl: './experience-words.component.html',
  styleUrls: ['./experience-words.component.scss']
})
export class ExperienceWordsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('textContainer') textContainer!: ElementRef<HTMLElement>;

  private words: HTMLElement[] = [];
  private currentHoverIndex: number = -1;
  private prefersReducedMotion: boolean = false;
  private animationTimeline?: gsap.core.Timeline;
  private isMobile: boolean = false;

  ngAfterViewInit(): void {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth <= 768;
    this.initializeWords();
    
    // Only setup hover listeners on desktop
    if (!this.isMobile) {
      this.setupHoverListeners();
    }
  }

  ngOnDestroy(): void {
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }
  }

  private initializeWords(): void {
    const container = this.textContainer.nativeElement;
    if (!container) return;

    const paragraphs = container.querySelectorAll('p');
    let globalIndex = 0;

    paragraphs.forEach((paragraph) => {
      const text = paragraph.textContent || '';
      // Split by whitespace, preserving words with punctuation
      const words = text.split(/\s+/).filter(word => word.trim().length > 0);

      const fragment = document.createDocumentFragment();
      
      words.forEach((word, wordIndex) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.setAttribute('data-index', globalIndex.toString());
        span.textContent = word;
        // On mobile, use active color; on desktop, use muted color
        span.style.color = this.isMobile ? this.getActiveColor() : this.getMutedColor();
        fragment.appendChild(span);
        
        // Add space after word (except for last word in paragraph)
        if (wordIndex < words.length - 1) {
          fragment.appendChild(document.createTextNode(' '));
        }
        
        globalIndex++;
      });

      paragraph.innerHTML = '';
      paragraph.appendChild(fragment);
    });

    this.words = Array.from(container.querySelectorAll('.word')) as HTMLElement[];
  }

  private setupHoverListeners(): void {
    const container = this.textContainer.nativeElement;
    if (!container) return;

    container.addEventListener('mouseenter', () => {
      // Reset on enter to ensure clean state
    });

    container.addEventListener('mouseleave', () => {
      this.resetAllWords();
    });

    this.words.forEach((word) => {
      word.addEventListener('mouseenter', (e) => {
        const index = parseInt(word.getAttribute('data-index') || '0', 10);
        this.revealWordsUpTo(index);
      });
    });
  }

  private revealWordsUpTo(targetIndex: number): void {
    if (this.currentHoverIndex === targetIndex) return;
    this.currentHoverIndex = targetIndex;

    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }

    const duration = this.prefersReducedMotion ? 0 : 0.5;
    const stagger = this.prefersReducedMotion ? 0 : 0.015;
    const ease = 'power2.out';

    this.animationTimeline = gsap.timeline();
    const timeline = this.animationTimeline;

    this.words.forEach((word, index) => {
      const wordIndex = parseInt(word.getAttribute('data-index') || '0', 10);
      const targetColor = wordIndex <= targetIndex ? this.getActiveColor() : this.getMutedColor();

      if (this.prefersReducedMotion) {
        word.style.color = targetColor;
      } else {
        timeline.to(
          word,
          {
            color: targetColor,
            duration: duration,
            ease: ease
          },
          index * stagger
        );
      }
    });
  }

  private resetAllWords(): void {
    this.currentHoverIndex = -1;

    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }

    const duration = this.prefersReducedMotion ? 0 : 0.35;
    const stagger = this.prefersReducedMotion ? 0 : 0.01;
    const ease = 'power2.out';

    this.animationTimeline = gsap.timeline();
    const timeline = this.animationTimeline;

    this.words.forEach((word, index) => {
      if (this.prefersReducedMotion) {
        word.style.color = this.getMutedColor();
      } else {
        timeline.to(
          word,
          {
            color: this.getMutedColor(),
            duration: duration,
            ease: ease
          },
          index * stagger
        );
      }
    });
  }

  private getMutedColor(): string {
    return '#424048';
  }

  private getActiveColor(): string {
    return '#E2C7E5';
  }
}

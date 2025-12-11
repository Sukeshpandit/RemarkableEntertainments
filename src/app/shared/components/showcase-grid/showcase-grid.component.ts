import { Component, Input } from '@angular/core';
import { ShowcaseCard } from '../experiences-cards/experiences-card.data';

@Component({
  selector: 'app-showcase-grid',
  templateUrl: './showcase-grid.component.html',
  styleUrls: ['./showcase-grid.component.scss']
})
export class ShowcaseGridComponent {
  @Input() cards: ShowcaseCard[] = [];

  toggleVideo(video: HTMLVideoElement, overlay: HTMLElement): void {
    if (video.paused) {
      video.play().then(() => {
        overlay.classList.add('hidden');
      }).catch(() => {
        // Handle autoplay restrictions
        overlay.classList.remove('hidden');
      });
    } else {
      video.pause();
      overlay.classList.remove('hidden');
    }
  }

  onVideoLoaded(video: HTMLVideoElement, overlay: HTMLElement): void {
    // Try to autoplay when video metadata is loaded
    video.play().then(() => {
      // Video is playing, keep overlay hidden
      overlay.classList.add('hidden');
    }).catch(() => {
      // If autoplay fails (browser restrictions), show the play button
      overlay.classList.remove('hidden');
    });
    
    // Also check if video is already playing (in case autoplay attribute worked)
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

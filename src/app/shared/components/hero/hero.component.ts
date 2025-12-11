import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('reversedVideo') reversedVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    // Delay hero video playback by 0.5 seconds
    setTimeout(() => {
      const heroVideo = this.heroVideo?.nativeElement;
      if (heroVideo) {
        heroVideo.play().catch((error) => {
          // Silently handle autoplay restrictions
          if (error.name !== 'NotAllowedError') {
            console.error('Error playing hero video:', error);
          }
        });
      }
    }, 200);  
    setTimeout(() => {
      const reversedVideo = this.reversedVideo?.nativeElement;
      if (reversedVideo) {
        reversedVideo.play().catch((error) => {
          // Silently handle autoplay restrictions
          if (error.name !== 'NotAllowedError') {
            console.error('Error playing reversed video:', error);
          }
        });
      }
    },200);
  }
}


import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @Input() headlineLine1: string[] = ['Together', 'we', 'Shape'];
  @Input() headlineLine2: string[] = ['Success', 'of your', 'Season'];
  @Input() subtitle: string = 'Remarkable Entertainments';
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('reversedVideo') reversedVideo!: ElementRef<HTMLVideoElement>;
  
  private syncInterval?: number;
  private monitorInterval?: number;
  private heroVideoReady = false;
  private reversedVideoReady = false;
  private userInteracted = false;
  private interactionHandler?: () => void;

  ngAfterViewInit(): void {
    const heroVideo = this.heroVideo?.nativeElement;
    const reversedVideo = this.reversedVideo?.nativeElement;

    if (!heroVideo || !reversedVideo) {
      return;
    }

    // Ensure videos are muted (required for autoplay)
    heroVideo.muted = true;
    reversedVideo.muted = true;

    // Set volume to 0 to ensure muted
    heroVideo.volume = 0;
    reversedVideo.volume = 0;

    // Explicitly load both videos
    heroVideo.load();
    reversedVideo.load();

    // Try to play immediately (before waiting for events)
    this.attemptPlay(heroVideo, reversedVideo);

    // Monitor for pause events and restart if needed
    heroVideo.addEventListener('pause', () => {
      if (!heroVideo.ended) {
        setTimeout(() => {
          if (heroVideo.paused && !heroVideo.ended) {
            heroVideo.play().catch(() => {});
          }
        }, 50);
      }
    });

    reversedVideo.addEventListener('pause', () => {
      if (!reversedVideo.ended) {
        setTimeout(() => {
          if (reversedVideo.paused && !reversedVideo.ended) {
            reversedVideo.play().catch(() => {});
          }
        }, 50);
      }
    });

    // Wait for both videos to be ready
    const checkAndStart = () => {
      if (this.heroVideoReady && this.reversedVideoReady) {
        this.startSynchronizedPlayback();
      }
    };

    // Simple event listeners
    const onHeroReady = () => {
      if (!this.heroVideoReady) {
        this.heroVideoReady = true;
        this.attemptPlay(heroVideo, reversedVideo);
        checkAndStart();
      }
    };

    const onReversedReady = () => {
      if (!this.reversedVideoReady) {
        this.reversedVideoReady = true;
        this.attemptPlay(heroVideo, reversedVideo);
        checkAndStart();
      }
    };

    // Listen for canplay event (fires when video can start playing)
    heroVideo.addEventListener('canplay', onHeroReady, { once: true });
    reversedVideo.addEventListener('canplay', onReversedReady, { once: true });

    // Also listen for loadedmetadata as fallback
    heroVideo.addEventListener('loadedmetadata', onHeroReady, { once: true });
    reversedVideo.addEventListener('loadedmetadata', onReversedReady, { once: true });

    // Check if already ready
    if (heroVideo.readyState >= 2) {
      onHeroReady();
    }
    if (reversedVideo.readyState >= 2) {
      onReversedReady();
    }

    // Multiple aggressive attempts to play
    const playAttempts = [100, 200, 300, 500, 750, 1000, 1500, 2000];
    playAttempts.forEach(delay => {
      setTimeout(() => {
        this.attemptPlay(heroVideo, reversedVideo);
        if (!this.heroVideoReady || !this.reversedVideoReady) {
          this.heroVideoReady = true;
          this.reversedVideoReady = true;
          checkAndStart();
        }
      }, delay);
    });

    // Continuous monitoring - ensure videos stay playing (more frequent)
    this.monitorInterval = window.setInterval(() => {
      if (heroVideo.paused && !heroVideo.ended && heroVideo.readyState >= 2) {
        heroVideo.play().catch(() => {});
      }
      if (reversedVideo.paused && !reversedVideo.ended && reversedVideo.readyState >= 2) {
        reversedVideo.play().catch(() => {});
      }
    }, 500);

    // Add global interaction handler to enable autoplay on first user interaction
    this.interactionHandler = () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        // Try to play videos on first interaction
        this.attemptPlay(heroVideo, reversedVideo);
        this.startSynchronizedPlayback();
      }
    };

    // Listen for any user interaction
    document.addEventListener('click', this.interactionHandler, { once: true });
    document.addEventListener('touchstart', this.interactionHandler, { once: true });
    document.addEventListener('keydown', this.interactionHandler, { once: true });
    window.addEventListener('scroll', this.interactionHandler, { once: true });
  }

  private attemptPlay(heroVideo: HTMLVideoElement, reversedVideo: HTMLVideoElement): void {
    // Try to play both videos immediately
    if (heroVideo.readyState >= 1) {
      heroVideo.play().catch(() => {});
    }
    if (reversedVideo.readyState >= 1) {
      reversedVideo.play().catch(() => {});
    }
  }

  private startSynchronizedPlayback(): void {
    const heroVideo = this.heroVideo?.nativeElement;
    const reversedVideo = this.reversedVideo?.nativeElement;

    if (!heroVideo || !reversedVideo) {
      return;
    }

    // Ensure muted
    heroVideo.muted = true;
    reversedVideo.muted = true;
    heroVideo.volume = 0;
    reversedVideo.volume = 0;

    // Reset both videos to start
    heroVideo.currentTime = 0;
    reversedVideo.currentTime = 0;

    // Function to start both videos simultaneously
    const startVideos = () => {
      // Start both videos at the same time - multiple attempts
      const playHero = heroVideo.play().catch((error) => {
        // Silently handle autoplay restrictions
      });

      const playReversed = reversedVideo.play().catch((error) => {
        // Silently handle autoplay restrictions
      });

      // Start sync after both videos start playing
      Promise.allSettled([playHero, playReversed]).then(() => {
        // Wait a bit then start syncing
        setTimeout(() => {
          // this.syncVideos();
        }, 100);
      });

      // Also try again after a short delay
      setTimeout(() => {
        if (heroVideo.paused) heroVideo.play().catch(() => {});
        if (reversedVideo.paused) reversedVideo.play().catch(() => {});
      }, 200);
    };

    // Use requestAnimationFrame for precise timing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startVideos();
      });
    });
  }

  private syncVideos(): void {
    const heroVideo = this.heroVideo?.nativeElement;
    const reversedVideo = this.reversedVideo?.nativeElement;

    if (!heroVideo || !reversedVideo) {
      return;
    }

    // Sync function - keep reversed video in sync with hero video
    const sync = () => {
      if (heroVideo.readyState >= 2 && reversedVideo.readyState >= 2) {
        const heroTime = heroVideo.currentTime;
        const heroDuration = heroVideo.duration;
        const reversedDuration = reversedVideo.duration;
        
        if (heroDuration > 0 && reversedDuration > 0 && !heroVideo.paused && !reversedVideo.paused) {
          // Calculate reverse time: if hero is at T, reversed should be at (duration - T)
          const targetReversedTime = reversedDuration - heroTime;
          
          // Sync if difference is more than 0.05 seconds (tighter threshold)
          if (Math.abs(reversedVideo.currentTime - targetReversedTime) > 0.05) {
            reversedVideo.currentTime = targetReversedTime;
          }
        }
      }
    };

    // Sync on hero video's timeupdate
    heroVideo.addEventListener('timeupdate', sync);
    
    // Also sync periodically to catch any drift (more frequent)
    this.syncInterval = window.setInterval(sync, 50);
  }

  ngOnDestroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }

    // Remove interaction handlers
    if (this.interactionHandler) {
      document.removeEventListener('click', this.interactionHandler);
      document.removeEventListener('touchstart', this.interactionHandler);
      document.removeEventListener('keydown', this.interactionHandler);
      window.removeEventListener('scroll', this.interactionHandler);
    }
    
    const heroVideo = this.heroVideo?.nativeElement;
    const reversedVideo = this.reversedVideo?.nativeElement;

    if (heroVideo) {
      heroVideo.pause();
    }

    if (reversedVideo) {
      reversedVideo.pause();
    }
  }
}


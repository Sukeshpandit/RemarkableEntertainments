import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isPanelOpen = false;

  constructor(private router: Router) {}

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
    // Prevent body scroll when panel is open
    if (this.isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closePanel(): void {
    this.isPanelOpen = false;
    document.body.style.overflow = '';
  }

  navigateTo(route: string): void {
    this.closePanel();
    this.router.navigate([`/${route}`]);
  }

  scrollToHero(): void {
    // Find the hero section element
    const heroElement = document.querySelector('app-hero');
    if (heroElement) {
      heroElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback: scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}


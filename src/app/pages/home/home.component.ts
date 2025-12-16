import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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


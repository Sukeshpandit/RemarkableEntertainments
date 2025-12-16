import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
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
}

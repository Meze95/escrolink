import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import AOS from 'aos';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private platformId = inject(PLATFORM_ID);

  initializeAOS() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100,
      disable: () => {
        const maxWidth = 768;
        return window.innerWidth < maxWidth;
      }
    });
  }

  refreshAOS() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    AOS.refresh();
  }
}


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  email = '';

  onSubscribe() {
    if (this.email) {
      console.log('Subscribing:', this.email);
      // Handle subscription logic
      this.email = '';
    }
  }
}

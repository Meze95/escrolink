import { Component, EventEmitter, Output, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  imports: [CommonModule],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify implements OnInit {
  @Output() switch = new EventEmitter<'login' | 'register' | 'verify'>();
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpValues = ['', '', '', '', '', ''];
  resendTimer = 30;
  canResend = false;
  userEmail: string = '';

  ngOnInit() {
    // Get email from sessionStorage (set by Register component)
    this.userEmail = sessionStorage.getItem('registrationEmail') || '';
    // Start the initial countdown
    this.startInitialCountdown();
  }

  get isOtpValid(): boolean {
    return this.otpValues.every(value => value.trim() !== '');
  }

  startInitialCountdown() {
    const interval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  onOtpInput(index: number, event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && /^\d$/.test(value)) {
      this.otpValues[index] = value;
      
      // Move to next input if current input is filled
      if (index < this.otpInputs.length - 1) {
        const nextInput = this.otpInputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      }
    } else {
      this.otpValues[index] = '';
      input.value = '';
    }
  }

  onOtpKeyDown(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // Handle backspace - move to previous input
    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }

    // Handle arrow keys
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && index < this.otpInputs.length - 1) {
      event.preventDefault();
      const nextInput = this.otpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  onVerify() {
    const token = this.otpValues.join('');
    if (token.length === 6) {
      console.log('Verification Token:', token);
      // Here you would send the token to your backend
    }
  }

  onResendToken() {
    if (!this.canResend) return;

    console.log('Resend token requested for email:', this.userEmail);
    this.canResend = false;
    this.resendTimer = 60;

    const interval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(interval);
      }
    }, 1000);

    // Clear OTP fields
    this.otpValues = ['', '', '', '', '', ''];
    this.otpInputs.forEach(input => {
      input.nativeElement.value = '';
    });
    this.otpInputs.first.nativeElement.focus();
  }
}


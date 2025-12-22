import { Component, ViewChildren, QueryList, ElementRef, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SocialLink {
  id: number;
  type: 'business' | 'personal';
  platform: string;
  url: string;
  verified: boolean;
}

interface BusinessDetails {
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  registrationNumber?: string;
}

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.scss',
})
export class ClientProfile implements OnDestroy {
  // Personal Details (from registration)
  profile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+234 801 234 5678',
    emailVerified: true,
    phoneVerified: true, // Changed to true for testing
    profilePicture: '' // New field for profile picture
  };

  // Business Details
  businessDetails: BusinessDetails = {
    businessName: 'Doe Enterprises',
    businessType: 'E-commerce',
    businessAddress: '123 Business Street, Lagos, Nigeria',
    businessPhone: '+234 802 345 6789',
    businessEmail: 'business@doeenterprises.com',
    registrationNumber: 'RC123456'
  };

  // Social Links
  socialLinks: SocialLink[] = [
    { id: 1, type: 'business', platform: 'Instagram', url: 'https://instagram.com/doeenterprises', verified: true },
    { id: 2, type: 'business', platform: 'Facebook', url: 'https://facebook.com/doeenterprises', verified: false },
    { id: 3, type: 'personal', platform: 'Twitter', url: 'https://twitter.com/johndoe', verified: true },
    { id: 4, type: 'personal', platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', verified: false }
  ];

  // Edit modes
  isEditingPersonal = false;
  isEditingBusiness = false;

  // Temporary edit data
  editPersonal = { ...this.profile };
  editBusiness = { ...this.businessDetails };
  newSocialLink: SocialLink = {
    id: 0,
    type: 'business',
    platform: '',
    url: '',
    verified: false
  };

  // Email update modal - Three step process
  showEmailUpdateModal = false;
  emailUpdateStep: 'verify-current' | 'enter-new' | 'verify-new' = 'verify-current';
  @ViewChildren('currentEmailOtpInput') currentEmailOtpInputs!: QueryList<ElementRef>;
  @ViewChildren('newEmailOtpInput') newEmailOtpInputs!: QueryList<ElementRef>;
  currentEmailOtpValues = ['', '', '', '', '', ''];
  newEmailOtpValues = ['', '', '', '', '', ''];
  emailResendTimer = 30;
  newEmailResendTimer = 30;
  canResendEmail = false;
  canResendNewEmail = false;
  private emailResendInterval: any = null;
  private newEmailResendInterval: any = null;
  newEmail = '';

  // Phone update modal - Three step process (or two if phone not verified)
  showPhoneUpdateModal = false;
  phoneUpdateStep: 'verify-current' | 'enter-new' | 'verify-new' = 'verify-current';
  @ViewChildren('currentPhoneOtpInput') currentPhoneOtpInputs!: QueryList<ElementRef>;
  @ViewChildren('newPhoneOtpInput') newPhoneOtpInputs!: QueryList<ElementRef>;
  currentPhoneOtpValues = ['', '', '', '', '', ''];
  newPhoneOtpValues = ['', '', '', '', '', ''];
  phoneResendTimer = 30;
  newPhoneResendTimer = 30;
  canResendPhone = false;
  canResendNewPhone = false;
  private phoneResendInterval: any = null;
  private newPhoneResendInterval: any = null;
  newPhoneNumber = '';

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  // Profile Picture Methods
  getInitials(): string {
    const firstInitial = this.profile.firstName ? this.profile.firstName[0] : '';
    const lastInitial = this.profile.lastName ? this.profile.lastName[0] : '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  isValidEmail(email: string): boolean {
    // RFC 5322 compliant email validation regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onProfilePictureSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Image = e.target.result;
      
      // In real app, upload to backend
      // POST /api/upload-profile-picture { image: base64Image }
      console.log('Uploading profile picture to backend...');
      
      // TODO: Replace with actual API call
      // this.http.post('/api/upload-profile-picture', { image: base64Image }).subscribe({
      //   next: (response: any) => {
      //     this.profile.profilePicture = response.imageUrl;
      //     alert('Profile picture updated successfully!');
      //   },
      //   error: (error) => {
      //     alert('Failed to upload profile picture. Please try again.');
      //   }
      // });

      // Simulate backend response - remove this in production
      this.profile.profilePicture = base64Image;
      alert('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  }

  removeProfilePicture(): void {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    // In real app, send to backend
    // DELETE /api/remove-profile-picture
    console.log('Removing profile picture from backend...');
    
    // TODO: Replace with actual API call
    // this.http.delete('/api/remove-profile-picture').subscribe({
    //   next: () => {
    //     this.profile.profilePicture = '';
    //     alert('Profile picture removed successfully!');
    //   },
    //   error: (error) => {
    //     alert('Failed to remove profile picture. Please try again.');
    //   }
    // });

    // Simulate backend response - remove this in production
    this.profile.profilePicture = '';
    alert('Profile picture removed successfully!');
  }

  // Email Update Methods
  openEmailUpdateModal(): void {
    this.showEmailUpdateModal = true;
    this.emailUpdateStep = 'verify-current';
    this.newEmail = '';
    this.currentEmailOtpValues = ['', '', '', '', '', ''];
    this.newEmailOtpValues = ['', '', '', '', '', ''];
    this.emailResendTimer = 30;
    this.newEmailResendTimer = 30;
    this.canResendEmail = false;
    this.canResendNewEmail = false;
    this.startEmailResendCountdown();
    
    // In real app, send OTP to current verified email
    // POST /api/send-email-otp { email: this.profile.email }
    console.log('Sending OTP to current verified email:', this.profile.email);
    
    // TODO: Replace with actual API call
    // this.http.post('/api/send-email-otp', { email: this.profile.email }).subscribe({
    //   next: (response) => {
    //     console.log('OTP sent successfully');
    //   },
    //   error: (error) => {
    //     alert('Failed to send OTP. Please try again.');
    //     this.closeEmailUpdateModal();
    //   }
    // });
  }

  closeEmailUpdateModal(): void {
    this.showEmailUpdateModal = false;
    this.emailUpdateStep = 'verify-current';
    this.newEmail = '';
    this.currentEmailOtpValues = ['', '', '', '', '', ''];
    this.newEmailOtpValues = ['', '', '', '', '', ''];
    this.clearEmailResendInterval();
    this.clearNewEmailResendInterval();
    this.emailResendTimer = 0;
    this.newEmailResendTimer = 0;
    this.canResendEmail = false;
    this.canResendNewEmail = false;
  }

  verifyCurrentEmailOtp(): void {
    const otp = this.currentEmailOtpValues.join('');
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }

    // In real app, send to backend to verify OTP from current email
    // POST /api/verify-current-email-otp { otp }
    console.log('Verifying OTP from current email:', otp);
    
    // TODO: Replace with actual API call
    // this.http.post('/api/verify-current-email-otp', { otp }).subscribe({
    //   next: (response: any) => {
    //     if (response.valid) {
    //       this.emailUpdateStep = 'enter-new';
    //       this.clearEmailResendInterval();
    //     } else {
    //       alert('Invalid verification code. Please try again.');
    //     }
    //   },
    //   error: (error) => {
    //     alert('Verification failed. Please try again.');
    //   }
    // });

    // Simulate backend verification - remove this in production
    this.emailUpdateStep = 'enter-new';
    this.clearEmailResendInterval();
  }

  submitNewEmail(): void {
    if (!this.newEmail) {
      alert('Please enter a new email address');
      return;
    }

    // Validate email format
    if (!this.isValidEmail(this.newEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    if (this.newEmail === this.profile.email) {
      alert('New email cannot be the same as current email');
      return;
    }

    // In real app, send new email to backend
    // POST /api/submit-new-email { newEmail }
    // Backend will send OTP to new email
    console.log('Submitting new email:', this.newEmail);
    
    // TODO: Replace with actual API call
    // this.http.post('/api/submit-new-email', { newEmail: this.newEmail }).subscribe({
    //   next: (response: any) => {
    //     if (response.success) {
    //       this.emailUpdateStep = 'verify-new';
    //       this.newEmailOtpValues = ['', '', '', '', '', ''];
    //       this.newEmailResendTimer = 30;
    //       this.canResendNewEmail = false;
    //       this.startNewEmailResendCountdown();
    //     } else {
    //       alert('Failed to send OTP. Please try again.');
    //     }
    //   },
    //   error: (error) => {
    //     alert('Failed to submit new email. Please try again.');
    //   }
    // });

    // Simulate backend response - remove this in production
    this.emailUpdateStep = 'verify-new';
    this.newEmailOtpValues = ['', '', '', '', '', ''];
    this.newEmailResendTimer = 30;
    this.canResendNewEmail = false;
    this.startNewEmailResendCountdown();
    console.log('OTP sent to new email:', this.newEmail);
  }

  verifyNewEmailOtp(): void {
    const otp = this.newEmailOtpValues.join('');
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }

    // In real app, send to backend: { newEmail, otp }
    // POST /api/verify-new-email-otp { newEmail, otp }
    console.log('Verifying OTP from new email:', {
      newEmail: this.newEmail,
      otp: otp
    });

    // TODO: Replace with actual API call
    // this.http.post('/api/verify-new-email-otp', { newEmail: this.newEmail, otp }).subscribe({
    //   next: (response: any) => {
    //     if (response.valid) {
    //       this.profile.email = this.newEmail;
    //       this.closeEmailUpdateModal();
    //       alert('Email updated successfully!');
    //     } else {
    //       alert('Invalid verification code. Please try again.');
    //     }
    //   },
    //   error: (error) => {
    //     alert('Verification failed. Please try again.');
    //   }
    // });

    // Simulate backend response - remove this in production
    this.profile.email = this.newEmail;
    this.closeEmailUpdateModal();
    alert('Email updated successfully!');
  }

  // Phone Update Methods
  openPhoneUpdateModal(): void {
    this.showPhoneUpdateModal = true;
    
    if (this.profile.phoneVerified) {
      // If phone is verified, start with verification step
      this.phoneUpdateStep = 'verify-current';
      this.currentPhoneOtpValues = ['', '', '', '', '', ''];
      this.phoneResendTimer = 30;
      this.canResendPhone = false;
      this.startPhoneResendCountdown();
      
      // In real app, send OTP to current verified phone
      // POST /api/send-phone-otp { phoneNumber: this.profile.phoneNumber }
      console.log('Sending OTP to current verified phone:', this.profile.phoneNumber);
      
      // TODO: Replace with actual API call
      // this.http.post('/api/send-phone-otp', { phoneNumber: this.profile.phoneNumber }).subscribe({
      //   next: (response) => {
      //     console.log('OTP sent successfully');
      //   },
      //   error: (error) => {
      //     alert('Failed to send OTP. Please try again.');
      //     this.closePhoneUpdateModal();
      //   }
      // });
    } else {
      // If phone is not verified, skip to enter new phone step
      this.phoneUpdateStep = 'enter-new';
      this.newPhoneNumber = '';
    }
    
    this.newPhoneOtpValues = ['', '', '', '', '', ''];
    this.newPhoneResendTimer = 30;
    this.canResendNewPhone = false;
  }

  closePhoneUpdateModal(): void {
    this.showPhoneUpdateModal = false;
    this.phoneUpdateStep = 'verify-current';
    this.newPhoneNumber = '';
    this.currentPhoneOtpValues = ['', '', '', '', '', ''];
    this.newPhoneOtpValues = ['', '', '', '', '', ''];
    this.clearPhoneResendInterval();
    this.clearNewPhoneResendInterval();
    this.phoneResendTimer = 0;
    this.newPhoneResendTimer = 0;
    this.canResendPhone = false;
    this.canResendNewPhone = false;
  }

  verifyCurrentPhoneOtp(): void {
    const otp = this.currentPhoneOtpValues.join('');
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }

    // In real app, send to backend to verify OTP from current phone
    // POST /api/verify-current-phone-otp { otp }
    console.log('Verifying OTP from current phone:', otp);
    
    // TODO: Replace with actual API call
    // this.http.post('/api/verify-current-phone-otp', { otp }).subscribe({
    //   next: (response: any) => {
    //     if (response.valid) {
    //       this.phoneUpdateStep = 'enter-new';
    //       this.clearPhoneResendInterval();
    //     } else {
    //       alert('Invalid verification code. Please try again.');
    //     }
    //   },
    //   error: (error) => {
    //     alert('Verification failed. Please try again.');
    //   }
    // });

    // Simulate backend verification - remove this in production
    this.phoneUpdateStep = 'enter-new';
    this.clearPhoneResendInterval();
  }

  submitNewPhoneNumber(): void {
    if (!this.newPhoneNumber || this.newPhoneNumber === this.profile.phoneNumber) {
      alert('Please enter a new phone number');
      return;
    }

    // In real app, send new phone to backend
    // POST /api/submit-new-phone { newPhoneNumber }
    // Backend will send OTP to new phone
    console.log('Submitting new phone:', this.newPhoneNumber);
    
    // TODO: Replace with actual API call
    // this.http.post('/api/submit-new-phone', { newPhoneNumber: this.newPhoneNumber }).subscribe({
    //   next: (response: any) => {
    //     if (response.success) {
    //       this.phoneUpdateStep = 'verify-new';
    //       this.newPhoneOtpValues = ['', '', '', '', '', ''];
    //       this.newPhoneResendTimer = 30;
    //       this.canResendNewPhone = false;
    //       this.startNewPhoneResendCountdown();
    //     } else {
    //       alert('Failed to send OTP. Please try again.');
    //     }
    //   },
    //   error: (error) => {
    //     alert('Failed to submit new phone. Please try again.');
    //   }
    // });

    // Simulate backend response - remove this in production
    this.phoneUpdateStep = 'verify-new';
    this.newPhoneOtpValues = ['', '', '', '', '', ''];
    this.newPhoneResendTimer = 30;
    this.canResendNewPhone = false;
    this.startNewPhoneResendCountdown();
    console.log('OTP sent to new phone:', this.newPhoneNumber);
  }

  verifyNewPhoneOtp(): void {
    const otp = this.newPhoneOtpValues.join('');
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }

    // In real app, send to backend: { newPhoneNumber, otp }
    // POST /api/verify-new-phone-otp { newPhoneNumber, otp }
    console.log('Verifying OTP from new phone:', {
      newPhoneNumber: this.newPhoneNumber,
      otp: otp
    });

    // TODO: Replace with actual API call
    // this.http.post('/api/verify-new-phone-otp', { newPhoneNumber: this.newPhoneNumber, otp }).subscribe({
    //   next: (response: any) => {
    //     if (response.valid) {
    //       this.profile.phoneNumber = this.newPhoneNumber;
    //       this.profile.phoneVerified = true;
    //       this.closePhoneUpdateModal();
    //       alert('Phone number updated successfully!');
    //     } else {
    //       alert('Invalid verification code. Please try again.');
    //     }
    //   },
    //   error: (error) => {
    //     alert('Verification failed. Please try again.');
    //   }
    // });

    // Simulate backend response - remove this in production
    this.profile.phoneNumber = this.newPhoneNumber;
    this.profile.phoneVerified = true;
    this.closePhoneUpdateModal();
    alert('Phone number updated successfully!');
  }

  // Email OTP Input Handlers
  get isCurrentEmailOtpValid(): boolean {
    return this.currentEmailOtpValues.every(value => value.trim() !== '');
  }

  get isNewEmailOtpValid(): boolean {
    return this.newEmailOtpValues.every(value => value.trim() !== '');
  }

  onCurrentEmailOtpInput(index: number, event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && /^\d$/.test(value)) {
      this.currentEmailOtpValues[index] = value;
      
      if (index < this.currentEmailOtpInputs.length - 1) {
        const nextInput = this.currentEmailOtpInputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      }
    } else {
      this.currentEmailOtpValues[index] = '';
      input.value = '';
    }
  }

  onCurrentEmailOtpKeyDown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const prevInput = this.currentEmailOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = this.currentEmailOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && index < this.currentEmailOtpInputs.length - 1) {
      event.preventDefault();
      const nextInput = this.currentEmailOtpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  onNewEmailOtpInput(index: number, event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && /^\d$/.test(value)) {
      this.newEmailOtpValues[index] = value;
      
      if (index < this.newEmailOtpInputs.length - 1) {
        const nextInput = this.newEmailOtpInputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      }
    } else {
      this.newEmailOtpValues[index] = '';
      input.value = '';
    }
  }

  onNewEmailOtpKeyDown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const prevInput = this.newEmailOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = this.newEmailOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && index < this.newEmailOtpInputs.length - 1) {
      event.preventDefault();
      const nextInput = this.newEmailOtpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  // Phone OTP Input Handlers
  get isCurrentPhoneOtpValid(): boolean {
    return this.currentPhoneOtpValues.every(value => value.trim() !== '');
  }

  get isNewPhoneOtpValid(): boolean {
    return this.newPhoneOtpValues.every(value => value.trim() !== '');
  }

  onCurrentPhoneOtpInput(index: number, event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && /^\d$/.test(value)) {
      this.currentPhoneOtpValues[index] = value;
      
      if (index < this.currentPhoneOtpInputs.length - 1) {
        const nextInput = this.currentPhoneOtpInputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      }
    } else {
      this.currentPhoneOtpValues[index] = '';
      input.value = '';
    }
  }

  onCurrentPhoneOtpKeyDown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const prevInput = this.currentPhoneOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = this.currentPhoneOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && index < this.currentPhoneOtpInputs.length - 1) {
      event.preventDefault();
      const nextInput = this.currentPhoneOtpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  onNewPhoneOtpInput(index: number, event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && /^\d$/.test(value)) {
      this.newPhoneOtpValues[index] = value;
      
      if (index < this.newPhoneOtpInputs.length - 1) {
        const nextInput = this.newPhoneOtpInputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      }
    } else {
      this.newPhoneOtpValues[index] = '';
      input.value = '';
    }
  }

  onNewPhoneOtpKeyDown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      event.preventDefault();
      const prevInput = this.newPhoneOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = this.newPhoneOtpInputs.toArray()[index - 1].nativeElement;
      prevInput.focus();
    } else if (event.key === 'ArrowRight' && index < this.newPhoneOtpInputs.length - 1) {
      event.preventDefault();
      const nextInput = this.newPhoneOtpInputs.toArray()[index + 1].nativeElement;
      nextInput.focus();
    }
  }

  // Email Resend Methods
  private clearEmailResendInterval(): void {
    if (this.emailResendInterval) {
      clearInterval(this.emailResendInterval);
      this.emailResendInterval = null;
    }
  }

  private clearNewEmailResendInterval(): void {
    if (this.newEmailResendInterval) {
      clearInterval(this.newEmailResendInterval);
      this.newEmailResendInterval = null;
    }
  }

  startEmailResendCountdown(): void {
    this.clearEmailResendInterval();
    this.emailResendTimer = 30;
    this.canResendEmail = false;
    
    this.ngZone.run(() => {
      this.emailResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.emailResendTimer--;
          if (this.emailResendTimer <= 0) {
            this.canResendEmail = true;
            this.clearEmailResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });
  }

  startNewEmailResendCountdown(): void {
    this.clearNewEmailResendInterval();
    this.newEmailResendTimer = 30;
    this.canResendNewEmail = false;
    
    this.ngZone.run(() => {
      this.newEmailResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.newEmailResendTimer--;
          if (this.newEmailResendTimer <= 0) {
            this.canResendNewEmail = true;
            this.clearNewEmailResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });
  }

  resendCurrentEmailOtp(): void {
    if (!this.canResendEmail) return;

    console.log('Resending OTP to current email:', this.profile.email);
    
    // In real app, send request to backend
    // POST /api/send-email-otp { email: this.profile.email }
    
    this.clearEmailResendInterval();
    this.canResendEmail = false;
    this.emailResendTimer = 60;

    this.ngZone.run(() => {
      this.emailResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.emailResendTimer--;
          if (this.emailResendTimer <= 0) {
            this.canResendEmail = true;
            this.clearEmailResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });

    this.currentEmailOtpValues = ['', '', '', '', '', ''];
    if (this.currentEmailOtpInputs && this.currentEmailOtpInputs.length > 0) {
      this.currentEmailOtpInputs.forEach(input => {
        input.nativeElement.value = '';
      });
      this.currentEmailOtpInputs.first.nativeElement.focus();
    }
  }

  resendNewEmailOtp(): void {
    if (!this.canResendNewEmail) return;

    console.log('Resending OTP to new email:', this.newEmail);
    
    // In real app, send request to backend
    // POST /api/send-email-otp { email: this.newEmail }
    
    this.clearNewEmailResendInterval();
    this.canResendNewEmail = false;
    this.newEmailResendTimer = 60;

    this.ngZone.run(() => {
      this.newEmailResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.newEmailResendTimer--;
          if (this.newEmailResendTimer <= 0) {
            this.canResendNewEmail = true;
            this.clearNewEmailResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });

    this.newEmailOtpValues = ['', '', '', '', '', ''];
    if (this.newEmailOtpInputs && this.newEmailOtpInputs.length > 0) {
      this.newEmailOtpInputs.forEach(input => {
        input.nativeElement.value = '';
      });
      this.newEmailOtpInputs.first.nativeElement.focus();
    }
  }

  // Phone Resend Methods
  private clearPhoneResendInterval(): void {
    if (this.phoneResendInterval) {
      clearInterval(this.phoneResendInterval);
      this.phoneResendInterval = null;
    }
  }

  private clearNewPhoneResendInterval(): void {
    if (this.newPhoneResendInterval) {
      clearInterval(this.newPhoneResendInterval);
      this.newPhoneResendInterval = null;
    }
  }

  startPhoneResendCountdown(): void {
    this.clearPhoneResendInterval();
    this.phoneResendTimer = 30;
    this.canResendPhone = false;
    
    this.ngZone.run(() => {
      this.phoneResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.phoneResendTimer--;
          if (this.phoneResendTimer <= 0) {
            this.canResendPhone = true;
            this.clearPhoneResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });
  }

  startNewPhoneResendCountdown(): void {
    this.clearNewPhoneResendInterval();
    this.newPhoneResendTimer = 30;
    this.canResendNewPhone = false;
    
    this.ngZone.run(() => {
      this.newPhoneResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.newPhoneResendTimer--;
          if (this.newPhoneResendTimer <= 0) {
            this.canResendNewPhone = true;
            this.clearNewPhoneResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });
  }

  resendCurrentPhoneOtp(): void {
    if (!this.canResendPhone) return;

    console.log('Resending OTP to current phone:', this.profile.phoneNumber);
    
    // In real app, send request to backend
    // POST /api/send-phone-otp { phoneNumber: this.profile.phoneNumber }
    
    this.clearPhoneResendInterval();
    this.canResendPhone = false;
    this.phoneResendTimer = 60;

    this.ngZone.run(() => {
      this.phoneResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.phoneResendTimer--;
          if (this.phoneResendTimer <= 0) {
            this.canResendPhone = true;
            this.clearPhoneResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });

    this.currentPhoneOtpValues = ['', '', '', '', '', ''];
    if (this.currentPhoneOtpInputs && this.currentPhoneOtpInputs.length > 0) {
      this.currentPhoneOtpInputs.forEach(input => {
        input.nativeElement.value = '';
      });
      this.currentPhoneOtpInputs.first.nativeElement.focus();
    }
  }

  resendNewPhoneOtp(): void {
    if (!this.canResendNewPhone) return;

    console.log('Resending OTP to new phone:', this.newPhoneNumber);
    
    // In real app, send request to backend
    // POST /api/send-phone-otp { phoneNumber: this.newPhoneNumber }
    
    this.clearNewPhoneResendInterval();
    this.canResendNewPhone = false;
    this.newPhoneResendTimer = 60;

    this.ngZone.run(() => {
      this.newPhoneResendInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.newPhoneResendTimer--;
          if (this.newPhoneResendTimer <= 0) {
            this.canResendNewPhone = true;
            this.clearNewPhoneResendInterval();
          }
          this.cdr.detectChanges();
        });
      }, 1000);
    });

    this.newPhoneOtpValues = ['', '', '', '', '', ''];
    if (this.newPhoneOtpInputs && this.newPhoneOtpInputs.length > 0) {
      this.newPhoneOtpInputs.forEach(input => {
        input.nativeElement.value = '';
      });
      this.newPhoneOtpInputs.first.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.clearEmailResendInterval();
    this.clearNewEmailResendInterval();
    this.clearPhoneResendInterval();
    this.clearNewPhoneResendInterval();
  }

  editPersonalDetails(): void {
    this.isEditingPersonal = true;
    this.editPersonal = { ...this.profile };
  }

  savePersonalDetails(): void {
    // Email and phone cannot be updated through this form
    // They must be updated through their respective update modals
    this.profile.firstName = this.editPersonal.firstName;
    this.profile.lastName = this.editPersonal.lastName;
    this.isEditingPersonal = false;
    alert('Personal details updated successfully!');
  }

  cancelEditPersonal(): void {
    this.isEditingPersonal = false;
    this.editPersonal = { ...this.profile };
  }

  editBusinessDetails(): void {
    this.isEditingBusiness = true;
    this.editBusiness = { ...this.businessDetails };
  }

  saveBusinessDetails(): void {
    this.businessDetails = { ...this.editBusiness };
    this.isEditingBusiness = false;
    alert('Business details updated successfully!');
  }

  cancelEditBusiness(): void {
    this.isEditingBusiness = false;
    this.editBusiness = { ...this.businessDetails };
  }

  addSocialLink(): void {
    if (this.newSocialLink.platform && this.newSocialLink.url) {
      this.newSocialLink.id = this.socialLinks.length + 1;
      this.socialLinks.push({ ...this.newSocialLink });
      this.newSocialLink = {
        id: 0,
        type: 'business',
        platform: '',
        url: '',
        verified: false
      };
    }
  }

  removeSocialLink(id: number): void {
    const link = this.socialLinks.find(l => l.id === id);
    if (link && link.verified) {
      alert('This link has been verified by admin and cannot be removed.');
      return;
    }
    this.socialLinks = this.socialLinks.filter(link => link.id !== id);
  }

  getBusinessLinks(): SocialLink[] {
    return this.socialLinks.filter(link => link.type === 'business');
  }

  getPersonalLinks(): SocialLink[] {
    return this.socialLinks.filter(link => link.type === 'personal');
  }
}
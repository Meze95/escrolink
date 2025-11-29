import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  @Output() switch = new EventEmitter<'login' | 'register' | 'verify'>();

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';

  get isFormValid(): boolean {
    return (
      this.isFirstNameValid() &&
      this.isLastNameValid() &&
      this.isEmailValid() &&
      this.isPhoneValid() &&
      this.isPasswordValid() &&
      this.isConfirmPasswordValid()
    );
  }

  isFirstNameValid(): boolean {
    return this.firstName.trim().length >= 2;
  }

  isLastNameValid(): boolean {
    return this.lastName.trim().length >= 2;
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.email.trim() !== '' && emailRegex.test(this.email);
  }

  isPhoneValid(): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/;
    return this.phoneNumber.trim() !== '' && phoneRegex.test(this.phoneNumber.replace(/\s/g, ''));
  }

  isPasswordValid(): boolean {
    return this.password.trim().length >= 6;
  }

  isConfirmPasswordValid(): boolean {
    return this.password === this.confirmPassword && this.confirmPassword.trim().length >= 6;
  }

  onCreateAccount() {
    if (!this.isFormValid) return;

    const formData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password
    };

    console.log('Register Form Data:', formData);
    // Store email for verify component
    sessionStorage.setItem('registrationEmail', this.email);
    this.switch.emit('verify');
  }
}

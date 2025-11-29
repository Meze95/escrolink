import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @Output() switch = new EventEmitter<'login' | 'register' | 'verify'>();

  email: string = '';
  password: string = '';

  get isFormValid(): boolean {
    return this.isEmailValid() && this.isPasswordValid();
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.email.trim() !== '' && emailRegex.test(this.email);
  }

  isPasswordValid(): boolean {
    return this.password.trim().length >= 6;
  }

  onLogin() {
    if (!this.isFormValid) return;

    const formData = {
      email: this.email,
      password: this.password
    };

    console.log('Login Form Data:', formData);
  }
}


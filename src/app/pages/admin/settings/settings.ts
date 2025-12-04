import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class AdminSettings implements OnInit {
  user = {
    name: 'ADMIN USER',
    email: 'admin@example.com',
    role: 'admin'
  };

  settings = {
    platformName: 'EscroLink',
    supportEmail: 'support@escrolink.com',
    transactionFee: 2.5,
    maxTransactionAmount: 1000000,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false
  };

  ngOnInit(): void {
  }

  savePlatformSettings(): void {
    console.log('Platform settings saved:', this.settings);
  }

  saveNotificationSettings(): void {
    console.log('Notification settings saved:', this.settings);
  }
}

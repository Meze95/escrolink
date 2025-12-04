import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../constants/menu.constants';

export const CLIENT_MENU: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '/clients/overview' },
  { id: 'transactions', label: 'Transactions', icon: 'chart', route: '/clients/transactions' },
  { id: 'products', label: 'My Products', icon: 'package', route: '/clients/products' },
  { id: 'profile', label: 'Profile', icon: 'settings', route: '/clients/profile' },
];
@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.scss',
})
export class ClientLayout implements OnInit {
  isSidebarOpen = false;
  activeMenu = 'dashboard';
  
  user = {
    name: 'CLIENT DOE',
    email: 'client@example.com',
    role: 'Client'
  };

  menuItems: MenuItem[] = [];
  notificationCount = 5;

  ngOnInit(): void {
    //This will get current-user from local-storage
    // Load menu items based on user role
    this.menuItems = CLIENT_MENU;
  }

  setActiveMenu(menuId: string): void {
    this.activeMenu = menuId;
    this.closeSidebar();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onMenuClick(menuId: string): void {
    this.activeMenu = menuId;
    this.closeSidebar();
  }

  onLogout(): void {
    this.logout();
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
  }
}

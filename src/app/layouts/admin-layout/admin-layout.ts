import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../constants/menu.constants';

export const ADMIN_MENU: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '/admin/overview' },
  { id: 'transactions', label: 'Transactions', icon: 'package', route: '/admin/transactions' },
  { id: 'clients', label: 'Clients', icon: 'users', route: '/admin/clients' },
  { id: 'users', label: 'Users', icon: 'users', route: '/admin/users' },
  { id: 'role-management', label: 'Role Managment', icon: 'settings', route: '/admin/role-management' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/admin/settings' }
];
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  isSidebarOpen = false;
  activeMenu = 'dashboard';
  
  user = {
    name: 'ADMIN DOE',
    email: 'admin@example.com',
    role: 'Admin'
  };

  menuItems: MenuItem[] = [];
  notificationCount = 5;

  ngOnInit(): void {
    //This will get current-user from local-storage
    // Load menu items based on user role
    this.menuItems = ADMIN_MENU;
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

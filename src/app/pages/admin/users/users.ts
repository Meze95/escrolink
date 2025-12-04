import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class AdminUsers implements OnInit {

  user = {
    name: 'ADMIN USER',
    email: 'admin@example.com',
    role: 'admin'
  };

  users: User[] = [
    {
      id: 'USR001',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 'USR002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-02-20'
    },
    {
      id: 'USR003',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'seller',
      status: 'active',
      joinDate: '2024-03-10'
    },
    {
      id: 'USR004',
      name: 'Grace Okonkwo',
      email: 'grace@example.com',
      role: 'buyer',
      status: 'suspended',
      joinDate: '2024-04-05'
    },
    {
      id: 'USR005',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'seller',
      status: 'inactive',
      joinDate: '2024-05-12'
    }
  ];

  ngOnInit(): void {
  }


  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      'admin': 'bg-purple-100 text-purple-700',
      'seller': 'bg-blue-100 text-blue-700',
      'buyer': 'bg-green-100 text-green-700'
    };
    return roleClasses[role] || 'bg-gray-100 text-gray-700';
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-700',
      'inactive': 'bg-yellow-100 text-yellow-700',
      'suspended': 'bg-red-100 text-red-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }
}

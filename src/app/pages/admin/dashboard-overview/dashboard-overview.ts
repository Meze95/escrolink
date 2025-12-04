import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthData, StatCard, Transaction } from '../../../models/dashboard-model';



@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.scss',
})
export class DashboardOverview implements OnInit {
  user = {
    name: 'JOHN DOE',
    email: 'johndoe@example.com',
    role: 'Admin'
  };


  stats: StatCard[] = [
    {
      label: 'Total Earnings',
      value: '₦628,450',
      icon: 'dollar',
      bgColor: 'bg-[#0B2C7B]',
      textColor: 'text-white'
    },
    {
      label: 'Active Deals',
      value: '24',
      icon: 'trending',
      bgColor: 'bg-white',
      textColor: 'text-gray-800'
    },
    {
      label: 'Pending Review',
      value: '8',
      icon: 'clock',
      bgColor: 'bg-white',
      textColor: 'text-gray-800'
    },
    {
      label: 'Completed',
      value: '142',
      icon: 'check',
      bgColor: 'bg-white',
      textColor: 'text-gray-800'
    }
  ];

  monthlyData: MonthData[] = [
    { month: 'JAN', transactions: 20, revenue: 35 },
    { month: 'FEB', transactions: 38, revenue: 45 },
    { month: 'MAR', transactions: 45, revenue: 28 },
    { month: 'APR', transactions: 32, revenue: 42 },
    { month: 'MAY', transactions: 28, revenue: 38 },
    { month: 'JUN', transactions: 48, revenue: 32 }
  ];

  recentTransactions: Transaction[] = [
    {
      id: 'TRX001',
      buyer: 'Sarah Johnson',
      amount: '₦45,000',
      status: 'completed',
      date: '2024-12-01',
      product: 'iPhone 13 Pro'
    },
    {
      id: 'TRX002',
      buyer: 'Mike Chen',
      amount: '₦82,500',
      status: 'pending',
      date: '2024-12-02',
      product: 'MacBook Air M2'
    },
    {
      id: 'TRX003',
      buyer: 'Aisha Mohammed',
      amount: '₦15,200',
      status: 'shipped',
      date: '2024-12-03',
      product: 'AirPods Pro'
    },
    {
      id: 'TRX004',
      buyer: 'David Brown',
      amount: '₦120,000',
      status: 'completed',
      date: '2024-11-30',
      product: 'Samsung S23 Ultra'
    },
    {
      id: 'TRX005',
      buyer: 'Grace Okonkwo',
      amount: '₦35,800',
      status: 'shipped',
      date: '2024-12-03',
      product: 'Sony Headphones'
    }
  ];

  successRate = 94;

  ngOnInit(): void {
    // Load menu items based on user role
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'completed': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'shipped': 'bg-blue-100 text-blue-700',
      'disputed': 'bg-red-100 text-red-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  getChartHeight(value: number): string {
    return `${value}%`;
  }

  getCircleOffset(percentage: number): number {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    return circumference * (1 - percentage / 100);
  }
}

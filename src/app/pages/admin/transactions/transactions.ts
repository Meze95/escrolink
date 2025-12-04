import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: string;
  seller: string;
  buyer: string;
  amount: string;
  product: string;
  status: 'completed' | 'pending' | 'disputed' | 'refunded';
  date: string;
}

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class AdminTransactions implements OnInit {
  user = {
    name: 'ADMIN USER',
    email: 'admin@example.com',
    role: 'admin'
  };

  openMenuId: string | null = null;
  showFilterPanel: boolean = false;
  filterStatus: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';

  showDetailModal: boolean = false;
  selectedTransaction: Transaction | null = null;
  transactionHistory: Array<{ label: string; date: string }> = [];

  transactions: Transaction[] = [
    {
      id: 'TRX001',
      seller: 'John Seller',
      buyer: 'Sarah Johnson',
      amount: '₦45,000',
      product: 'iPhone 13 Pro',
      status: 'completed',
      date: '2024-12-01'
    },
    {
      id: 'TRX002',
      seller: 'Mike Store',
      buyer: 'Mike Chen',
      amount: '₦82,500',
      product: 'MacBook Air M2',
      status: 'pending',
      date: '2024-12-02'
    },
    {
      id: 'TRX003',
      seller: 'Grace Shop',
      buyer: 'Aisha Mohammed',
      amount: '₦15,200',
      product: 'AirPods Pro',
      status: 'completed',
      date: '2024-12-03'
    },
    {
      id: 'TRX004',
      seller: 'Tech Hub',
      buyer: 'David Brown',
      amount: '₦120,000',
      product: 'Samsung S23 Ultra',
      status: 'disputed',
      date: '2024-11-30'
    },
    {
      id: 'TRX005',
      seller: 'Audio World',
      buyer: 'Grace Okonkwo',
      amount: '₦35,800',
      product: 'Sony Headphones',
      status: 'refunded',
      date: '2024-12-03'
    }
  ];

  allTransactions: Transaction[] = [];

  ngOnInit(): void {
    this.allTransactions = [...this.transactions];
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'completed': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'disputed': 'bg-red-100 text-red-700',
      'refunded': 'bg-blue-100 text-blue-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  toggleMenu(transactionId: string): void {
    this.openMenuId = this.openMenuId === transactionId ? null : transactionId;
  }

  viewTransaction(transaction: Transaction): void {
    this.openMenuId = null;
    this.selectedTransaction = transaction;
    this.showDetailModal = true;
    // Example timeline, replace with real data if available
    this.transactionHistory = [
      { label: 'Created', date: transaction.date },
      { label: 'Payment made', date: transaction.date },
      { label: 'Shipped', date: transaction.date },
      { label: transaction.status === 'completed' ? 'Completed' : transaction.status === 'refunded' ? 'Refunded' : transaction.status === 'disputed' ? 'Disputed' : 'Pending', date: transaction.date }
    ];
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedTransaction = null;
    this.transactionHistory = [];
  }

  editTransaction(transaction: Transaction): void {
    console.log('Edit transaction:', transaction);
    this.openMenuId = null;
    // Navigate to edit transaction
  }

  downloadReceipt(transaction: Transaction): void {
    console.log('Download receipt for:', transaction);
    this.openMenuId = null;
    // Implement download logic
  }

  refundTransaction(transaction: Transaction): void {
    console.log('Refund transaction:', transaction);
    this.openMenuId = null;
    // Implement refund logic
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.transactions = [...this.allTransactions];
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters(): void {
    this.transactions = this.allTransactions.filter(transaction => {
      // Filter by status
      if (this.filterStatus && transaction.status !== this.filterStatus) {
        return false;
      }

      // Filter by date range
      if (this.filterFromDate) {
        const transactionDate = new Date(transaction.date);
        const fromDate = new Date(this.filterFromDate);
        if (transactionDate < fromDate) {
          return false;
        }
      }

      if (this.filterToDate) {
        const transactionDate = new Date(transaction.date);
        const toDate = new Date(this.filterToDate);
        if (transactionDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }
  
}

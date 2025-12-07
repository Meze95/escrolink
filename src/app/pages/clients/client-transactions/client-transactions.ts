import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction, BuyerDetails, DeliveryDetails, TransactionProduct } from '../../../models/transaction.model';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-client-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-transactions.html',
  styleUrl: './client-transactions.scss',
})
export class ClientTransactions implements OnInit {
  // Sample products - in real app, this would come from a service
  availableProducts: Product[] = [
    { id: 1, name: 'Product A', description: 'Description A', amount: 100 },
    { id: 2, name: 'Product B', description: 'Description B', amount: 200 },
    { id: 3, name: 'Product C', description: 'Description C', amount: 150 }
  ];

  transactions: Transaction[] = [
    {
      id: 'TRX001',
      seller: 'Current User',
      buyer: {
        firstName: 'John',
        lastName: 'Doe',
        tel: '+234 801 234 5678',
        email: 'john.doe@example.com'
      },
      delivery: {
        deliveryType: 'home',
        fullAddress: '123 Main Street',
        addressLine2: 'Apt 4B',
        state: 'Lagos',
        country: 'Nigeria'
      },
      products: [
        {
          productId: 1,
          productName: 'Product A',
          quantity: 2,
          unitPrice: 100,
          totalAmount: 200
        }
      ],
      totalAmount: 200,
      status: 'pending',
      date: '2024-12-01'
    }
  ];

  showCreateModal = false;
  openMenuId: string | null = null;
  showViewModal = false;
  showWaybillModal = false;
  selectedTransaction: Transaction | null = null;
  transactionHistory: Array<{ description: string; currentStatus: string; historyDate: string }> = [];
  waybillDetails = {
    trackingNumber: '',
    deliveryCompany: '',
    comment: ''
  };
  
  // Form data
  buyerDetails: BuyerDetails = {
    firstName: '',
    lastName: '',
    tel: '',
    email: ''
  };

  deliveryDetails: DeliveryDetails = {
    deliveryType: 'home',
    fullAddress: '',
    addressLine2: '',
    state: '',
    country: 'Nigeria'
  };

  selectedProducts: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  }> = [];

  currentProductSelection: {
    productId: number | string | null;
    quantity: number;
    customPrice: number | null;
  } = {
    productId: null,
    quantity: 1,
    customPrice: null
  };

  ngOnInit(): void {
    // Initialize with empty form
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetForm();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.buyerDetails = {
      firstName: '',
      lastName: '',
      tel: '',
      email: ''
    };
    this.deliveryDetails = {
      deliveryType: 'home',
      fullAddress: '',
      addressLine2: '',
      state: '',
      country: 'Nigeria'
    };
    this.selectedProducts = [];
    this.currentProductSelection = {
      productId: null,
      quantity: 1,
      customPrice: null
    };
  }

  getSelectedProduct(): Product | undefined {
    if (!this.currentProductSelection.productId) return undefined;
    const productId = typeof this.currentProductSelection.productId === 'string' 
      ? parseInt(this.currentProductSelection.productId, 10) 
      : this.currentProductSelection.productId;
    return this.availableProducts.find(p => p.id === productId);
  }

  onProductSelected(): void {
    const product = this.getSelectedProduct();
    if (product && !this.currentProductSelection.customPrice) {
      // Auto-populate the custom price with the product's default price
      this.currentProductSelection.customPrice = product.amount;
    }
  }

  getCurrentUnitPrice(): number {
    const product = this.getSelectedProduct();
    if (!product) return 0;
    return this.currentProductSelection.customPrice ?? product.amount;
  }

  calculateProductTotal(): number {
    if (!this.currentProductSelection.productId || this.currentProductSelection.quantity <= 0) return 0;
    const unitPrice = this.getCurrentUnitPrice();
    return unitPrice * this.currentProductSelection.quantity;
  }

  addProductToTransaction(): void {
    const product = this.getSelectedProduct();
    if (!product || !this.currentProductSelection.productId || this.currentProductSelection.quantity <= 0) {
      return;
    }

    const unitPrice = this.getCurrentUnitPrice();
    const totalAmount = unitPrice * this.currentProductSelection.quantity;

    // Check if product already exists, update quantity instead
    const productId = typeof this.currentProductSelection.productId === 'string' 
      ? parseInt(this.currentProductSelection.productId, 10) 
      : this.currentProductSelection.productId;
    
    const existingIndex = this.selectedProducts.findIndex(
      p => p.productId === productId
    );

    if (existingIndex >= 0) {
      // Update existing product
      this.selectedProducts[existingIndex].quantity += this.currentProductSelection.quantity;
      this.selectedProducts[existingIndex].totalAmount = 
        this.selectedProducts[existingIndex].unitPrice * this.selectedProducts[existingIndex].quantity;
    } else {
      // Add new product
      this.selectedProducts.push({
        productId: product.id,
        productName: product.name,
        quantity: this.currentProductSelection.quantity,
        unitPrice: unitPrice,
        totalAmount: totalAmount
      });
    }

    // Reset selection
    this.currentProductSelection = {
      productId: null,
      quantity: 1,
      customPrice: null
    };
  }

  removeProductFromTransaction(index: number): void {
    this.selectedProducts.splice(index, 1);
  }

  calculateTotalAmount(): number {
    return this.selectedProducts.reduce((sum, product) => sum + product.totalAmount, 0);
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

  createTransaction(): void {
    // Validate form
    if (!this.buyerDetails.firstName || !this.buyerDetails.lastName || 
        !this.buyerDetails.tel || !this.buyerDetails.email) {
      alert('Please fill in all buyer details');
      return;
    }

    if (!this.deliveryDetails.fullAddress || !this.deliveryDetails.state || 
        !this.deliveryDetails.country) {
      alert('Please fill in all delivery details');
      return;
    }

    if (this.selectedProducts.length === 0) {
      alert('Please add at least one product');
      return;
    }

    // Create transaction
    const newTransaction: Transaction = {
      id: 'TRX' + Date.now().toString().slice(-6),
      seller: 'Current User', // In real app, get from auth service
      buyer: { ...this.buyerDetails },
      delivery: { ...this.deliveryDetails },
      products: [...this.selectedProducts],
      totalAmount: this.calculateTotalAmount(),
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    this.transactions.unshift(newTransaction);
    this.closeCreateModal();
  }

  getProductNames(products: TransactionProduct[]): string {
    return products.map(p => `${p.productName} (x${p.quantity})`).join(', ');
  }

  toggleMenu(transactionId: string): void {
    this.openMenuId = this.openMenuId === transactionId ? null : transactionId;
  }

  viewTransaction(transaction: Transaction): void {
    this.openMenuId = null;
    this.selectedTransaction = transaction;
    this.showViewModal = true;
    
    // Populate transaction history
    // Use transaction date with current time for creation
    const creationDate = new Date(transaction.date);
    creationDate.setHours(new Date().getHours());
    creationDate.setMinutes(new Date().getMinutes());
    creationDate.setSeconds(new Date().getSeconds());
    
    this.transactionHistory = [
      {
        description: 'Transaction Created',
        currentStatus: 'Pending',
        historyDate: this.formatDateTime(creationDate.toISOString())
      }
    ];

    // Add additional history based on status
    if (transaction.status === 'paid' || transaction.status === 'completed') {
      this.transactionHistory.push({
        description: 'Payment Made',
        currentStatus: 'Paid',
        historyDate: this.formatDateTime(new Date().toISOString())
      });
    }

    if (transaction.status === 'completed') {
      this.transactionHistory.push({
        description: 'Product Sent',
        currentStatus: 'Sent',
        historyDate: this.formatDateTime(new Date().toISOString())
      });
    }

    if (transaction.status === 'disputed') {
      this.transactionHistory.push({
        description: 'Transaction Disputed',
        currentStatus: 'Disputed',
        historyDate: this.formatDateTime(new Date().toISOString())
      });
    }

    if (transaction.status === 'refunded') {
      this.transactionHistory.push({
        description: 'Transaction Refunded',
        currentStatus: 'Refunded',
        historyDate: this.formatDateTime(new Date().toISOString())
      });
    }
  }

  formatDateTime(dateString: string): string {
    // If dateString is just a date (YYYY-MM-DD), add time
    let date: Date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      // If it's just a date, use current time
      date = new Date(dateString + 'T' + new Date().toTimeString().split(' ')[0]);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedTransaction = null;
    this.transactionHistory = [];
  }

  openWaybillModal(transaction: Transaction): void {
    this.openMenuId = null;
    this.selectedTransaction = transaction;
    this.waybillDetails = {
      trackingNumber: '',
      deliveryCompany: '',
      comment: ''
    };
    this.showWaybillModal = true;
  }

  closeWaybillModal(): void {
    this.showWaybillModal = false;
    this.selectedTransaction = null;
    this.waybillDetails = {
      trackingNumber: '',
      deliveryCompany: '',
      comment: ''
    };
  }

  saveWaybillDetails(): void {
    if (!this.selectedTransaction) return;
    
    if (!this.waybillDetails.deliveryCompany) {
      alert('Please fill in delivery company');
      return;
    }

    // Update transaction with waybill details
    const index = this.transactions.findIndex(t => t.id === this.selectedTransaction!.id);
    if (index !== -1) {
      // In a real app, you would update the transaction object with waybill details
      // For now, we'll just show a success message
      alert('Waybill details saved successfully!');
    }

    this.closeWaybillModal();
  }

  copyPaymentLink(transaction: Transaction): void {
    this.openMenuId = null;
    
    // Generate payment link
    const baseUrl = window.location.origin;
    const paymentLink = `${baseUrl}/payment/${transaction.id}`;

    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(paymentLink).then(() => {
        alert('Payment link copied to clipboard!');
      }).catch(() => {
        this.fallbackCopyToClipboard(paymentLink);
      });
    } else {
      this.fallbackCopyToClipboard(paymentLink);
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Payment link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link. Please copy manually: ' + text);
    }
    document.body.removeChild(textArea);
  }
}

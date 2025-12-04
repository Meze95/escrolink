
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  products = [
    { id: 1, name: 'Product A', description: 'Description A', amount: 100 },
    { id: 2, name: 'Product B', description: 'Description B', amount: 200 }
  ];
  showModal = false;
  newProduct = { name: '', description: '', amount: null };

  openModal() {
    this.showModal = true;
    this.newProduct = { name: '', description: '', amount: null };
  }

  closeModal() {
    this.showModal = false;
  }

  addProduct() {
    if (this.newProduct.name && typeof this.newProduct.amount === 'number') {
      this.products.push({
        id: Date.now(),
        name: this.newProduct.name,
        description: this.newProduct.description,
        amount: this.newProduct.amount
      });
      this.closeModal();
    }
  }

  editProduct(product: any) {
    // Implement edit logic
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}

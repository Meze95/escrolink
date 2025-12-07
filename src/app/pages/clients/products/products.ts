
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  products: Product[] = [
    { id: 1, name: 'Product A', description: 'Description A', amount: 100 },
    { id: 2, name: 'Product B', description: 'Description B', amount: 200 }
  ];
  showModal = false;
  isEditMode = false;
  editingProductId: number | null = null;
  newProduct = { name: '', description: '', amount: null as number | null };

  openModal() {
    this.showModal = true;
    this.isEditMode = false;
    this.editingProductId = null;
    this.newProduct = { name: '', description: '', amount: null };
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingProductId = null;
    this.newProduct = { name: '', description: '', amount: null };
  }

  editProduct(product: Product) {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.newProduct = {
      name: product.name,
      description: product.description,
      amount: product.amount
    };
    this.showModal = true;
  }

  saveProduct() {
    if (this.newProduct.name && typeof this.newProduct.amount === 'number') {
      if (this.isEditMode && this.editingProductId !== null) {
        // Update existing product
        const index = this.products.findIndex(p => p.id === this.editingProductId);
        if (index !== -1) {
          this.products[index] = {
            id: this.editingProductId,
            name: this.newProduct.name,
            description: this.newProduct.description,
            amount: this.newProduct.amount
          };
        }
      } else {
        // Add new product
        this.products.push({
          id: Date.now(),
          name: this.newProduct.name,
          description: this.newProduct.description,
          amount: this.newProduct.amount
        });
      }
      this.closeModal();
    }
  }

  addProduct() {
    this.saveProduct();
  }

  updateProduct() {
    this.saveProduct();
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}

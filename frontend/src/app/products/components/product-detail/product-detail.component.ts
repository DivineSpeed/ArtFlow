import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../cart/services/cart.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  @Input() product: any;
  @Output() cartAdd = new EventEmitter<any>();

  showModal: boolean = false;
  selectedProduct: any;
  selectedQuantity: number = 1;

  constructor(private cartService: CartService) { }

  openModal(product: any) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addToCart() {
    if (this.selectedQuantity <= 0) {
      alert('Please select a valid quantity.');
      return;
    }

    this.cartService.addToCart(this.selectedProduct.id, this.selectedQuantity).subscribe({
      next: (response) => {
        alert(response); // Display the success message
        this.closeModal();
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        alert(err.message || 'Failed to add product to cart.');
      },
    });
  }
}

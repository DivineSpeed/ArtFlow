import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  cartItems: {
    id: number; // idPanierItem
    productId: number; // idProduit
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    quantity: number;
    stockQuantity: number;
  }[] = [];

  constructor(private cartService: CartService) { }
  

  ngOnInit(): void {
    this.loadCartItems();
  }

  /** Fetch cart items from the backend */
  loadCartItems(): void {
    this.cartService.getCartItemsFromBackend().subscribe({
      next: (items) => {
        this.cartItems = items; // No need to map here, already mapped in service
      },
      error: (err) => {
        if (err.status === 404) {
          console.warn('Cart not found. Likely empty.');
          this.cartItems = [];
        } else {
          console.error('Failed to load cart items:', err);
          alert('Unable to load your cart. Please try again later.');
        }
      }
    });
  }


  /** Remove an item from the cart */
  removeFromCart(cartItemId: number, productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        // Update the local cart items after successful removal
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
        console.log(`Item with Cart ID ${cartItemId} and Product ID ${productId} removed successfully.`);
      },
      error: (err) => {
        console.error('Failed to remove item:', err);
        alert('Unable to remove the item. Please try again.');
      }
    });
  }

  /** Confirm and remove an item from the cart */
  confirmRemove(cartItemId: number, productId: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.removeFromCart(cartItemId, productId);
    }
  }

  /** Handle quantity change for an item */
  updateQuantity(cartItemId: number, productId: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    const item = this.cartItems.find(item => item.id === cartItemId);
    if (item && newQuantity > item.stockQuantity) {
      alert(`Cannot exceed available stock (${item.stockQuantity}).`);
      return;
    }

    this.cartService.updateItemQuantity(productId, newQuantity).subscribe({
      next: () => {
        if (item) {
          item.quantity = newQuantity; // Update the quantity locally
          console.log(`Item quantity updated: Cart ID ${cartItemId}, Product ID ${productId}, New Quantity: ${newQuantity}`);
        }
      },
      error: (err) => {
        console.error('Failed to update quantity:', err);
        alert('Unable to update quantity. Please try again.');
      }
    });
  }

  /** Calculate the total price of the cart */
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

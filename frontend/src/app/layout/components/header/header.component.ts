import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/services/auth.service';
import { CartService } from '../../../cart/services/cart.service'; // Adjust path as needed

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService,
    private router: Router,
    private cartService: CartService
  ) { };

  User = {
    token: "",
    role: "",
    userId: ""
  };

  isLoggedIn = false;
  isFixedNavbar = false;
  cartItemCount = 0;
  private cartSubscription: Subscription | null = null;

  ngOnInit(): void {
    // Check if the user is initially logged in based on the presence of the token
    const token = sessionStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (this.isLoggedIn) {
      this.User.token = token || "";
      this.User.role = sessionStorage.getItem('role') || "";
      this.User.userId = sessionStorage.getItem('userId') || "";
    }

    // Fetch cart items and update count
    this.cartSubscription = this.cartService.getCartItemsFromBackend().subscribe({
      next: (items) => {
        this.cartItemCount = items.length;
      },
      error: (error) => {
        console.error('Error fetching cart items', error);
        this.cartItemCount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    // Prevent memory leaks by unsubscribing
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  logout() {
   
        // Clear session storage
        sessionStorage.clear();
        // Redirect to home or login page
        this.router.navigate(['/']);
      
  }

  // Method to create a new store
  createStore() {
    // Navigate to store creation page or open a modal
    this.router.navigate(['/create-store']);
  }
}
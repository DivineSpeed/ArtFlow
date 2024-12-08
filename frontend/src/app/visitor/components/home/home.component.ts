import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { CommonModule } from '@angular/common';
import { ProductDetailComponent } from '../../../products/components/product-detail/product-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { CartService } from '../../../cart/services/cart.service';
import { HeaderComponent } from "../../../layout/components/header/header.component"; // Import CartService

@Component({
  selector: 'app-visitor',
  standalone: true,
  imports: [CommonModule, ProductDetailComponent, HttpClientModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  testimonials: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalProducts: number = 0;

  constructor(
    private productService: ProductService,
    private dataService: DataService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    this.initializeCart();
    this.loadProducts();
    this.categories = this.dataService.getCategories();
    this.testimonials = this.dataService.getTestimonials();
  }

  /** Initialize the cart by checking if a session exists or creating a new cart */
  initializeCart(): void {
    this.cartService.validateOrCreateCart().subscribe({
      next: () => console.log('Cart validated or created successfully.'),
      error: (error) => console.error('Failed to validate or create cart:', error),
    });
  }

  loadProducts(): void {
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe((result) => {
      this.products = result.products;
      this.totalProducts = result.total;      
    });
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalProducts) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  canGoNext(): boolean {
    return this.currentPage * this.pageSize < this.totalProducts;
  }
}

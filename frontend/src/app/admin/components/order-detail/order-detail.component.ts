// order-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: './order-detail.component.html',
  styles: './order-detail.component.css'
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      const numericOrderId = Number(orderId); // Convert to number
      if (!isNaN(numericOrderId)) { // Ensure the conversion was successful
        this.orderService.getOrderById(numericOrderId).subscribe({
          next: (order) => {
            this.order = order;
          },
          error: (error) => {
            console.error('Error fetching order details:', error);
            // Handle error appropriately
          }
        });
      } else {
        console.error('Invalid orderId: Not a number');
        // Handle invalid ID appropriately
      }
    }
  }
  

  getTotalItems(): number {
    return this.order?.panier?.items?.reduce((total, item) => total + item.quantite, 0) || 0;
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }
}
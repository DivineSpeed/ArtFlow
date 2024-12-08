import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../cart/services/order.service';
import { CommonModule, NgClass } from '@angular/common';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit {

  currentItem = 0;

  orderDetails: any = null; // Mapped order details
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private orderService: OrderService, private EmailService: EmailService) { }

  ngOnInit(): void {
    const orderId = "15" /*this.orderService.getOrderId();*/

    if (!orderId) {
      this.errorMessage = 'Order ID not found!';
      this.isLoading = false;
      return;
    }

    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => {
        this.orderDetails = data;
        this.isLoading = false;
        this.EmailService.sendThankYouEmail(data)
      .then(() => {
        console.log('Thank you email sent successfully');
      })
      .catch(error => {
        console.error('Failed to send thank you email', error);
        // Optionally show a user-friendly error message
      });
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.errorMessage = 'Failed to load order details. Please try again later.';
        this.isLoading = false;
      }
    });


    

  }



  nextItem(): void {
    this.currentItem = (this.currentItem + 1) % this.orderDetails.items.length;
  }

  prevItem(): void {
    this.currentItem = (this.currentItem - 1 + this.orderDetails.items.length) % this.orderDetails.items.length;
  }

  setCurrentItem(index: number): void {
    this.currentItem = index;
  }


}



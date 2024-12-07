import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as Handlebars from 'handlebars';  // Import Handlebars


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor(private http: HttpClient) { }

  async sendThankYouEmail(orderDetails: any): Promise<void> {
    try {
      console.log(orderDetails.items)
      // Load the email template
      const template = await this.loadEmailTemplate();

      // Replace placeholders in the template
      const compiledTemplate = Handlebars.compile(template);

      // Pass the order details to the template for dynamic content rendering
      const htmlContent = compiledTemplate({
        firstName: orderDetails.contactInfo.firstName,
        orderId: orderDetails.id,
        items: orderDetails.items,
        shippingAddress: orderDetails.shippingAddress.address,
        city: orderDetails.shippingAddress.city,
        postalCode: orderDetails.shippingAddress.postalCode,
        country: orderDetails.shippingAddress.country,
        email: orderDetails.contactInfo.email,
        phone: orderDetails.contactInfo.phone,
        totalAmount: orderDetails.totalPrice
      });

      // Prepare the email payload for SendGrid API
      const emailPayload = {
        personalizations: [{
          to: [{ email: `${orderDetails.contactInfo.email}` }],
          subject: `Thank you for your purchase! Order #ART${orderDetails.id}`
        }],
        from: {
          email: 'ArtFlowInc@proton.me',
          name: 'ArtFlow'
        },
        content: [{
          type: 'text/html',
          value: htmlContent
        }]
      };

      // Prepare headers
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${environment.sendgridApiKey}`,
        'Content-Type': 'application/json'
      });

      // Send email via HttpClient
      return new Promise((resolve, reject) => {
        this.http.post('/send-email', emailPayload, { headers })
          .subscribe({
            next: () => {
              console.log('Email sent successfully');
              resolve();
            },
            error: (error) => {
              console.error('Error sending email:', error);
              reject(error);
            }
          });
      });

    } catch (error) {
      console.error('Error preparing email:', error);
      throw error;
    }
  }

  // Method to load email template from assets
  private loadEmailTemplate(): Promise<string> {
    return fetch('assets/email-template.html')
      .then(response => response.text());
  }

  // Helper method to format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
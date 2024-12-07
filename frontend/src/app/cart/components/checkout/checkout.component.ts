import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICountry } from 'ngx-countries-dropdown';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCountriesDropdownModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private OrderService: OrderService
  ) {
    this.checkoutForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/), // Allows only letters and spaces
          Validators.minLength(2), // Full name should have at least 2 characters
          Validators.maxLength(50) // Limit to 50 characters
        ]
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5), // Address should have at least 5 characters
          Validators.maxLength(100) // Limit to 100 characters
        ]
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/), // Allows only letters and spaces
          Validators.minLength(2), // At least 2 characters
          Validators.maxLength(50) // Limit to 50 characters
        ]
      ],
      zipCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4,10}$/) // Allows only numbers, 4 to 10 digits
        ]
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s()]+$/) // Allows only letters and spaces
        ]
      ],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^\+?[0-9]{7,15}$/) // Validates international numbers with optional '+' prefix
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(100) // Limit email length to 100 characters
        ]
      ]
    });

  }

  countryListConfig = {
    hideDialCode: true, // This hides the country code
    hideCode: true

  };

  selectedCountryConfig = {
    hideDialCode: true, // This hides the country code
    hideCode: true

  };

  ngOnInit(): void { }

  onCountryChange(country: ICountry) {
    const countryCode = country.name || '';
    this.checkoutForm.get('country')?.setValue(countryCode);
  }


  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Split fullName into first and last names
      const fullName = this.checkoutForm.value.fullName.trim();
      const [firstName, ...lastNameParts] = fullName.split(' '); // Split by space
      const lastName = lastNameParts.join(' '); // Join remaining parts as last name

      // Prepare formData
      const formData = {
        nomVisiteur: lastName || '', // Use an empty string if no last name
        prenomVisiteur: firstName || '', // Use an empty string if no first name
        dateCommande: new Date().toISOString(),
        adresseLivraison: this.checkoutForm.value.address,
        ville: this.checkoutForm.value.city,
        codePostal: this.checkoutForm.value.zipCode,
        pays: this.checkoutForm.value.country,
        numeroTelephone: this.checkoutForm.value.phoneNumber,
        email: this.checkoutForm.value.email
      };

      this.http.post('http://localhost:8955/Commandes/creer', formData, { withCredentials: true }).subscribe({
        next: (response: any) => {
          console.log('Order placed successfully:', response.IdCommande);
          this.OrderService.setOrderId(response.IdCommande);
          this.router.navigate(['/thank-you']); // Pass orderId via state
        },
        error: (error) => {
          console.error('Order submission failed:', error);
          alert('Error placing order. Please try again.');
        }
      });
    }
  }

}




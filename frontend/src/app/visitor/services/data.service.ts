import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return [
      { name: 'Sculptures', imageUrl: 'assets/categories/sculptures.png' },
      { name: 'Paintings', imageUrl: 'assets/categories/paintings.png' },
      { name: 'Photography', imageUrl: 'assets/categories/photography.png' },
      { name: 'Digital Art', imageUrl: 'assets/categories/digital-drawing.png' },
    ];
  }

  // Testimonials data
  getTestimonials() {
    return [
      { message: 'Amazing artworks! Highly recommended.', name: 'John Doe' },
      { message: 'The quality is outstanding, and the process was smooth.', name: 'Jane Smith' },
      { message: 'Unique pieces that I couldn’t find elsewhere!', name: 'Emily Johnson' },
    ];
  }


  private baseUrl = 'http://localhost:8955';


  // Fetch total number of stores
  getTotalStores(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/boutiques/All`).pipe(
      map(stores => stores.length) // Map to the length of the array
    );
  }

  // Fetch total revenue from orders
  getTotalRevenue(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/Commandes/All`).pipe(
      map(orders =>
        orders.reduce((total, order) => total + order.prixTotalCommande, 0) // Sum all total prices
      )
    );
  }

  // Fetch total number of products
  getTotalProducts(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/produits/public/products`).pipe(
      map(products => products.length) // Map to the length of the array
    );
  }
  
  getTotalCountriesRepresented(): Observable<number> {
    return forkJoin({
      countriesFromBoutiques: this.http.get<any[]>(`${this.baseUrl}/boutiques/All`).pipe(
        map(boutiques => boutiques.map(boutique => this.extractCountry(boutique.adresseBoutique)))
      ),
      countriesFromOrders: this.http.get<any[]>(`${this.baseUrl}/Commandes/All`).pipe(
        map(orders => orders.map(order => order.pays))
      )
    }).pipe(
      map(({ countriesFromBoutiques, countriesFromOrders }) => {
        const allCountries = [...countriesFromBoutiques, ...countriesFromOrders];
        const uniqueCountries = new Set(allCountries); // Remove duplicates
        return uniqueCountries.size; // Return total count
      })
    );
  }
  
  // Helper function to extract country from an address
  private extractCountry(address: string): string {
    const countryRegex = /,\s*([A-Za-z\s]+)$/; // Match the last part of the address after a comma
    const match = address.match(countryRegex);
    return match ? match[1].trim() : 'Unknown';
  }
  
}

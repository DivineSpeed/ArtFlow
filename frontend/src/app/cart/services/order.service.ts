import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8955/Commandes'; // Backend base URL
  private orderId!: string; // Store orderId for state management

  setOrderId(orderId: string): void {
    this.orderId = orderId;
  }

  // Get the orderId
  getOrderId(): string | undefined {
    return this.orderId;
  }

  /** Fetch order details by orderId */
  getOrderDetails(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCommandeByID/${orderId}`).pipe(
      map((response: any) => this.mapOrderDetails(response)),
      catchError((error) => {
        console.error('Failed to fetch order details:', error);
        return throwError(() => error);
      })
    );
  }

  /** Map raw backend data to order summary format */
  private mapOrderDetails(data: any): any {
    return {
      id: data.idCommande,
      date: data.dateCommande,
      totalPrice: data.prixTotalCommande,
      shippingAddress: {
        address: data.adresseLivraison,
        city: data.ville,
        postalCode: data.codePostal,
        country: data.pays,
      },
      contactInfo: {
        firstName: data.prenomVisiteur,
        lastName: data.nomVisiteur,
        phone: data.numeroTelephone,
        email: data.email,
      },
      items: data.panier.items.map((item: any) => ({
        name: item.produit.nomProduit,
        description: item.produit.descriptionProduit,
        price: item.produit.prix,
        quantity: item.quantite,
        image: item.produit.imageProduit,
        store: item.produit.boutique.nomBoutique,
        artist: `${item.produit.boutique.artisan.prenomArtisan} ${item.produit.boutique.artisan.nomArtisan}`,
      })),
    };
  }

}

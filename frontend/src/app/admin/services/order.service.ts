import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';




export interface StatusPriority {
  [key: string]: number;
}

// Detailed Order interface based on the JSON structure you provided
export interface Order {
  idCommande: number;
  panier: {
    idPanier: number;
    sessionId: string;
    dateCreation: string;
    items: OrderItem[];
  };
  dateCommande: string;
  prixTotalCommande: number;
  adresseLivraison: string;
  ville: string;
  codePostal: string;
  pays: string;
  numeroTelephone: string;
  email: string;
  nomVisiteur: string;
  prenomVisiteur: string;
}

export interface OrderItem {
  idPanierItem: number;
  produit: {
    idProduit: number;
    nomProduit: string;
    descriptionProduit: string;
    prix: number;
    quantiteEnStock: number;
    imageProduit: string;
    boutique: {
      idBoutique: number;
      nomBoutique: string;
    };
  };
  quantite: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8955/Commandes';

  constructor(private http: HttpClient) { }

  // Fetch all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/All`).pipe(
      catchError(error => {
        console.error('Error fetching orders', error);
        throw error;
      })
    );
  }

  // Get order by ID
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/getCommandeByID/${orderId}`).pipe(
      catchError(error => {
        console.error(`Error fetching order with ID ${orderId}`, error);
        throw error;
      })
    );
  }

  // Delete order by ID
  /*(WIP)deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteCommandesByid/${orderId}`).pipe(
      catchError(error => {
        console.error(`Error deleting order with ID ${orderId}`, error);
        throw error;
      })
    );
  }*/

  // Additional method to get order status (if needed)
  getOrderStatus(orderId: number): Observable<string> {
    return this.getOrderById(orderId).pipe(
      // You might want to implement a more sophisticated status determination
      // based on your backend logic
      map(order => {
        // Example status determination (you'll need to adjust based on your exact requirements)
        const currentDate = new Date();
        const orderDate = new Date(order.dateCommande);
        const daysSinceOrder = (currentDate.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);

        if (daysSinceOrder < 1) return 'PENDING';
        if (daysSinceOrder < 3) return 'PROCESSING';
        if (daysSinceOrder < 7) return 'SHIPPED';
        return 'DELIVERED';
      }),
      catchError(error => {
        console.error(`Error determining order status for ID ${orderId}`, error);
        return of('UNKNOWN');
      })
    );
  }
}
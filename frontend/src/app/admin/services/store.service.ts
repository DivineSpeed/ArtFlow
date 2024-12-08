import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Artisan {
  idArtisan: number;
  nomArtisan: string;
  prenomArtisan: string;
}

export interface Store {
  idBoutique: number;
  nomBoutique: string;
  description: string;
  adresseBoutique: string;
  dateCreation: Date;
  artisan: Artisan;
  facebookLink: string;
  instagramLink: string;

  // Computed properties
  totalArtworksListed?: number;
  totalSales?: number;
  totalRevenue?: number;
}

interface Product {
  boutique: {
    idBoutique: number;
  };
}

interface Order {
  panier: {
    items: Array<{
      produit: {
        boutique: {
          idBoutique: number;
        };
      };
      quantite: number;
    }>;
  };
  prixTotalCommande: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private baseUrl = 'http://localhost:8955';

  constructor(private http: HttpClient) { }

  getAllStores(): Observable<Store[]> {
    return forkJoin({
      stores: this.fetchStores(),
      products: this.fetchAllProducts(),
      orders: this.fetchAllOrders()
    }).pipe(
      map(({ stores, products, orders }) => {
        return stores.map(store => {
          // Calculate total artworks for each store
          const storeProducts = products.filter(
            product => product.boutique.idBoutique === store.idBoutique
          );

          // Calculate total sales and revenue for each store
          const storeOrders = orders.filter(order =>
            order.panier.items.some(
              item => item.produit.boutique.idBoutique === store.idBoutique
            )
          );

          return {
            ...store,
            totalArtworksListed: storeProducts.length,
            totalSales: storeOrders.length,
            totalRevenue: storeOrders.reduce(
              (total, order) => total + order.prixTotalCommande,
              0
            )
          };
        }).sort((a, b) =>
          // Sort by total revenue in descending order
          (b.totalRevenue || 0) - (a.totalRevenue || 0)
        );
      }),
      catchError(error => {
        console.error('Error fetching store data', error);
        return of([]);
      })
    );
  }

  getStoreById(storeId: number): Observable<Store> {
    return this.http.get<Store>(`${this.baseUrl}/boutiques/getBoutiqueById/${storeId}`).pipe(
      catchError(error => {
        console.error('Error deleting store', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  private fetchStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/boutiques/All`).pipe(
      catchError(error => {
        console.error('Error deleting store', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  private fetchAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/produits/public/products`).pipe(
      catchError(error => {
        console.error('Error deleting store', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  private fetchAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/Commandes/All`).pipe(
      catchError(error => {
        console.error('Error deleting store', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  deleteStore(storeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/boutiques/deleteBoutiqueByid/${storeId}`).pipe(
      catchError(error => {
        console.error('Error deleting store', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }
}
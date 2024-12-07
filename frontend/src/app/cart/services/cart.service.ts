import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  

  private apiUrl = 'http://localhost:8955/cart'; // Backend base URL

  constructor(private http: HttpClient) { }

  /** Fetch cart items from the backend */
  getCartItemsFromBackend(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getPanierItems`, { withCredentials: true }).pipe(
      map(items => this.mapCartItems(items)), // Use the mapping function
      catchError((error) => {
        console.error('Failed to fetch cart items:', error);
        throw error;
      })
    );
  }

  /** Map raw backend data to cart item objects */
  private mapCartItems(items: any[]): any[] {
    return items.map(item => ({
      id: item.idPanierItem, // Cart item ID
      productId: item.produit.idProduit, // Product ID for backend operations
      name: item.produit.nomProduit, // Product name
      price: item.produit.prix, // Product price
      imageUrl: item.produit.imageProduit, // Product image URL
      description: item.produit.descriptionProduit || 'No description available', // Product description
      quantity: item.quantite || 1, // Default quantity if not provided
      stockQuantity: item.produit.quantiteEnStock || 0 // Stock available for quantity selector
    }));
  }

  /** Validate session or create a new cart */
  validateOrCreateCart(): Observable<void> {
    return this.http.get(`${this.apiUrl}/getPanier`, { withCredentials: true }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          // If cart doesn't exist, create a new one
          return this.createCart();
        } else {
          throw error;
        }
      }),
      map(() => void 0)
    );
  }


  /** Create a new cart */
  createCart(): Observable<void> {
    return this.http.post(`${this.apiUrl}/creer`, null, {
      withCredentials: true,
    }).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error('Error creating cart:', error);
        throw error;
      })
    );
  }



  /** Add a product to the backend cart */
  addToCart(productId: number, quantity: number): Observable<string> {
    return this.validateOrCreateCart().pipe(
      switchMap(() => {
        const params = new HttpParams()
          .set('quantite', quantity.toString())
          .set('Idproduit', productId.toString());

        return this.http.post<{ message: string }>(`${this.apiUrl}/ajouter`, null, {
          params,
          withCredentials: true,
        }).pipe(map(response => response.message));
      }),
      catchError((error) => {
        console.error('Failed to add to cart:', error);
        throw error;
      })
    );
  }


  /** Remove a product from the cart on the backend */
  removeFromCart(productId: number): Observable<void> {
    const params = new HttpParams().set('Idproduit', productId.toString());
    return this.http.delete<void>(`${this.apiUrl}/removeItem`, { params, withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Failed to remove item:', error);
        throw error;
      })
    );
  }

  /** Update the quantity of a product in the cart on the backend */
  updateItemQuantity(productId: number, quantity: number): Observable<void> {
    const params = new HttpParams()
      .set('Idproduit', productId.toString())
      .set('quantite', quantity.toString());

    return this.http.put<void>(`${this.apiUrl}/updateQuantity`, null, {
      params,
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        console.error('Failed to update quantity:', error);
        throw error;
      })
    );
  }
  
}

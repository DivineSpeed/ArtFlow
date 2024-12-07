import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiUrl = 'http://localhost:8955';

  constructor(private httpClient: HttpClient) { }

  updateProfile(body: any) {
    return this.httpClient.put(this.apiUrl + "/artisans/updateProfile", body);
  }

  findProductById(id: number) {
    const userId = sessionStorage.getItem('userId');
    return this.httpClient.post(`${this.apiUrl}/produits/artisan/getProduitById/` + id.toString(), {
      userId: userId
    });
  }
  updateProductById(id: number, body: any) {
    return this.httpClient.put(`${this.apiUrl}/produits/artisan/updateProduit/` + id.toString(), body);

  }


  getList() {
    const userId = sessionStorage.getItem('userId'); // Retrieve the user's ID
    return this.httpClient.get(this.apiUrl + "/Commandes/getCommandeByIDArtisan/" + userId);
  }
  addProduct(body: any) {
    const userId = sessionStorage.getItem('userId'); // Retrieve the user's ID

    return this.httpClient.post(this.apiUrl + "/produits/artisan/addProduct", body);
  }
  getProductByUSer() {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');  // Retrieve the user's role
    const userId = sessionStorage.getItem('userId'); // Retrieve the user's ID
    return this.httpClient.post(`${this.apiUrl}/produits/artisan/getProduitsByArtisanActif`, Number(userId));
  }
  getStoreById() {
    const userId = sessionStorage.getItem('userId'); // Retrieve the user's ID
    return this.httpClient.post(`${this.apiUrl}/produits/artisan/getBoutiqueByUserId`, Number(userId));
  }

  deleteProductById(id: number) {
    const userId = sessionStorage.getItem('userId'); // Retrieve the user's ID
    return this.httpClient.delete(`${this.apiUrl}/produits/artisan/deleteProduit/` + id.toString());
  }

  



  getAllProducts(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/produits/public/products`).pipe(
      map(products =>
        products.map(product => ({
          id: product.idProduit,
          name: product.nomProduit,
          price: product.prix,
          imageUrl: product.imageProduit, // Adjust if images are served from the backend
          description: product.descriptionProduit,
          stock: product.quantiteEnStock, // Useful for showing stock availability
          store: {
            name: product.boutique.nomBoutique,
            description: product.boutique.description
          },
          artistName: `${product.boutique.artisan.prenomArtisan} ${product.boutique.artisan.nomArtisan}`
        }))
      )
    );
  }

  getProducts(page: number = 1, pageSize: number = 6): Observable<{ products: any[]; total: number }> {
    return this.getAllProducts().pipe(
      map(allProducts => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
          products: allProducts.slice(start, end),
          total: allProducts.length
        };
      })
    );
  }


}






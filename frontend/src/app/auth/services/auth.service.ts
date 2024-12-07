import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'http://localhost:8955';

  constructor(private httpClient: HttpClient) {}

  signIn(body: any): Observable<any> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.httpClient.post<any>(`${this.apiUrl}/boutiques/createBoutique`, body, httpOptions);
  }

  login(body:any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return this.httpClient.post(this.apiUrl+"/auth/login", body, httpOptions);
  }
  logout() {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    // Clear authentication token from local storage
    sessionStorage.clear()
    return this.httpClient.post<any>(`${this.apiUrl}/auth/logout`,httpOptions);

    // Reload the current page
  }
  
}

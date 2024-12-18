import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map } from 'rxjs';
import { DataService } from '../../visitor/services/data.service';

// Interfaces for the data structures
interface Store {
  idBoutique: string;
  dateCreation: string;
}

interface Product {
  idProduit: string;
  nomProduit: string;
}

interface CartItem {
  produit: Product;
  quantite: number;
}

interface Order {
  dateCommande: string;
  prixTotalCommande: number;
  pays: string;
  panier: {
    items: CartItem[];
  };
}

interface TimeSeriesData {
  monthly: Array<{
    month: string;
    storesAdded?: number;
    revenue?: number;
    orders?: number;
  }>;
  quarterly: Array<{
    quarter: string;
    storesAdded?: number;
    revenue?: number;
    orders?: number;
  }>;
  yearly: Array<{
    year: string;
    storesAdded?: number;
    revenue?: number;
    orders?: number;
  }>;
}

interface TopSellingArtwork {
  artworkId: string;
  name: string;
  totalSales: number;
}

export interface TransformedData {
  revenueOverTime: TimeSeriesData;
  ordersOverTime: TimeSeriesData;
  storesOverTime: TimeSeriesData;
  totalStores: number;
  totalOrders: number;
  totalRevenue: number;
  topSellingArtworks: TopSellingArtwork[];
  customerDemographics: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = 'http://localhost:8955';

  constructor(private http: HttpClient, DataService : DataService) { }

  // Fetch stores data
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/boutiques/All`);
  }

  // Fetch orders data
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/Commandes/All`);
  }

  // Get all analytics data in one call
  getAnalyticsData(): Observable<TransformedData> {
    return combineLatest([
      this.getStores(),
      this.getOrders()
    ]).pipe(
      map(([storesData, ordersData]) => this.transformAPIData(storesData, ordersData))
    );
  }

  private getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' });
  }

  private getYear(dateString: string): number {
    return new Date(dateString).getFullYear();
  }

  private generateTimeSeriesData(
    data: (string | Order)[],
    dataType: 'stores' | 'revenue' | 'orders'
  ): TimeSeriesData {
    // Get the current year
    const currentYear = new Date().getFullYear();

    const monthlyMap = new Map<string, number>();
    const quarterlyMap = new Map<string, number>();
    const yearlyMap = new Map<string, number>();

    data.forEach(item => {
      let date: Date;
      let month: string;
      let year: number;
      let quarter: string;

      if (dataType === 'stores') {
        date = new Date(item as string);
        month = this.getMonth(item as string);
        year = date.getFullYear();
        quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
      } else {
        const orderItem = item as Order;
        date = new Date(orderItem.dateCommande);
        month = this.getMonth(orderItem.dateCommande);
        year = date.getFullYear();
        quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
      }

      // Always track total yearly data across all years
      if (dataType === 'revenue') {
        const orderItem = item as Order;
        yearlyMap.set(year.toString(), (yearlyMap.get(year.toString()) || 0) + orderItem.prixTotalCommande);
      } else {
        yearlyMap.set(year.toString(), (yearlyMap.get(year.toString()) || 0) + 1);
      }

      // Only add to monthly and quarterly if it's the current year
      if (year === currentYear) {
        if (dataType === 'revenue') {
          const orderItem = item as Order;
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + orderItem.prixTotalCommande);
          quarterlyMap.set(quarter, (quarterlyMap.get(quarter) || 0) + orderItem.prixTotalCommande);
        } else {
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
          quarterlyMap.set(quarter, (quarterlyMap.get(quarter) || 0) + 1);
        }
      }
    });

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyData = Array.from(monthlyMap, ([month, value]) => ({
      month,
      [dataType === 'stores' ? 'storesAdded' : (dataType === 'revenue' ? 'revenue' : 'orders')]: value
    })).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

    const quarterlyData = Array.from(quarterlyMap, ([quarter, value]) => ({
      quarter,
      [dataType === 'stores' ? 'storesAdded' : (dataType === 'revenue' ? 'revenue' : 'orders')]: value
    })).sort((a, b) => {
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      return quarters.indexOf(a.quarter) - quarters.indexOf(b.quarter);
    });

    const yearlyData = Array.from(yearlyMap, ([year, value]) => ({
      year,
      [dataType === 'stores' ? 'storesAdded' : (dataType === 'revenue' ? 'revenue' : 'orders')]: value
    }));

    return { monthly: monthlyData, quarterly: quarterlyData, yearly: yearlyData };
  }

  transformAPIData(storesData: Store[], ordersData: Order[]): TransformedData {
    // Process stores data
    const storesCreationDates = storesData.map(store => store.dateCreation);
    const uniqueStores = [...new Set(storesData.map(store => store.idBoutique))];

    // Calculate total revenue
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.prixTotalCommande, 0);

    // Top selling artworks
    const topSellingArtworks = ordersData.reduce<TopSellingArtwork[]>((acc, order) => {
      order.panier.items.forEach(item => {
        const existingArtwork = acc.find(a => a.artworkId === item.produit.idProduit.toString());
        if (existingArtwork) {
          existingArtwork.totalSales += item.quantite;
        } else {
          acc.push({
            artworkId: item.produit.idProduit.toString(),
            name: item.produit.nomProduit,
            totalSales: item.quantite
          });
        }
      });
      return acc;
    }, [])
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    // Calculate customer demographics
    const customerDemographics = ordersData.reduce<{ [key: string]: number }>((acc, order) => {
      const country = order.pays;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    return {
      revenueOverTime: this.generateTimeSeriesData(ordersData, 'revenue'),
      ordersOverTime: this.generateTimeSeriesData(ordersData, 'orders'),
      storesOverTime: this.generateTimeSeriesData(storesCreationDates, 'stores'),
      totalStores: uniqueStores.length,
      totalOrders: ordersData.length,
      totalRevenue: Math.round(totalRevenue),
      topSellingArtworks,
      customerDemographics
    };
  }
}

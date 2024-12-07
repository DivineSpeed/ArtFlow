import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor() { }

  getDashboardData(): Observable<any> {
    const staticData = {
      revenueOverTime: {
        monthly: [
          { month: "January", revenue: 5000 },
          { month: "February", revenue: 6000 },
          { month: "March", revenue: 7000 },
          { month: "April", revenue: 6500 },
          { month: "May", revenue: 7500 },
          { month: "June", revenue: 8000 },
          { month: "July", revenue: 7200 },
          { month: "August", revenue: 6900 },
          { month: "September", revenue: 7400 },
          { month: "October", revenue: 8500 },
          { month: "November", revenue: 9200 },
          { month: "December", revenue: 9500 }
        ],
        quarterly: [
          { quarter: "Q1", revenue: 18000 },
          { quarter: "Q2", revenue: 22000 },
          { quarter: "Q3", revenue: 21500 },
          { quarter: "Q4", revenue: 27000 }
        ],
        yearly: [
          { year: "2023", revenue: 77000 },
          { year: "2024", revenue: 70000 }
        ]
      },
      ordersOverTime: {
        monthly: [
          { month: "January", orders: 100 },
          { month: "February", orders: 120 },
          { month: "March", orders: 150 },
          { month: "April", orders: 130 },
          { month: "May", orders: 160 },
          { month: "June", orders: 170 },
          { month: "July", orders: 140 },
          { month: "August", orders: 130 },
          { month: "September", orders: 150 },
          { month: "October", orders: 180 },
          { month: "November", orders: 200 },
          { month: "December", orders: 210 }
        ],
        quarterly: [
          { quarter: "Q1", orders: 370 },
          { quarter: "Q2", orders: 460 },
          { quarter: "Q3", orders: 420 },
          { quarter: "Q4", orders: 590 }
        ],
        yearly: [
          { year: "2023", orders: 1400 },
          { year: "2024", orders: 1200 }
        ]
      },
      storesOverTime: {
        monthly: [
          { month: "January", storesAdded: 5 },
          { month: "February", storesAdded: 6 },
          { month: "March", storesAdded: 7 },
          { month: "April", storesAdded: 5 },
          { month: "May", storesAdded: 8 },
          { month: "June", storesAdded: 7 },
          { month: "July", storesAdded: 6 },
          { month: "August", storesAdded: 5 },
          { month: "September", storesAdded: 6 },
          { month: "October", storesAdded: 7 },
          { month: "November", storesAdded: 8 },
          { month: "December", storesAdded: 9 }
        ],
        quarterly: [
          { quarter: "Q1", storesAdded: 18 },
          { quarter: "Q2", storesAdded: 21 },
          { quarter: "Q3", storesAdded: 18 },
          { quarter: "Q4", storesAdded: 24 }
        ],
        yearly: [
          { year: "2023", storesAdded: 70 },
          { year: "2024", storesAdded: 60 }
        ]
      },
      totalStores: 150,
      totalOrders: 1500,
      totalRevenue: 110000,
      activeArtists: 60,
      topSellingArtworks: [
        { artworkId: "A123", name: "Artwork A", totalSales: 200 },
        { artworkId: "B234", name: "Artwork B", totalSales: 180 },
        { artworkId: "C345", name: "Artwork C", totalSales: 150 },
        { artworkId: "D456", name: "Artwork D", totalSales: 120 },
        { artworkId: "E567", name: "Artwork E", totalSales: 110 },
        { artworkId: "F678", name: "Artwork F", totalSales: 100 },
        { artworkId: "G789", name: "Artwork G", totalSales: 95 },
        { artworkId: "H890", name: "Artwork H", totalSales: 80 },
        { artworkId: "I901", name: "Artwork I", totalSales: 75 },
        { artworkId: "J012", name: "Artwork J", totalSales: 70 }
      ],
      customerDemographics: {
        "North America": 400,
        "Europe": 350,
        "Asia": 100,
        "Other": 150
      }
    };

    return of(staticData);
  }

  
}

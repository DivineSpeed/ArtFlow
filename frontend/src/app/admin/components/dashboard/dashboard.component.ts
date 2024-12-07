import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  revenueOverTime: any;
  ordersOverTime: any;
  storesOverTime: any;
  totalStores: number | undefined;
  totalOrders: number | undefined;
  totalRevenue: number | undefined;
  topSellingArtworks: any[] | undefined;
  customerDemographics: any;

  selectedTimePeriod: string = 'monthly';

  // Chart data
  lineChartLabels: string[] = [];
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  lineChartLegend = true;
  lineChartType: ChartType = 'line';

  revenueChartData: ChartDataset[] = [];
  ordersStoresChartData: ChartDataset[] = [];

  barChartData: ChartDataset[] = [];
  barChartLabels: string[] = [];
  barChartOptions: ChartOptions = {
    responsive: true
  };
  barChartLegend = true;
  barChartType: ChartType = 'bar';

  pieChartData: ChartDataset[] = [];
  pieChartLabels: string[] = [];
  pieChartOptions: ChartOptions = {
    responsive: true
  };
  pieChartLegend = true;
  pieChartType: ChartType = 'pie';

  isLoading: boolean = true;

  chartAnimationOptions: ChartOptions = {
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    responsive: true,
    hover: {
      
    }
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getDashboardData().subscribe({next: (data) => {
      this.totalStores = data.totalStores;
      this.totalOrders = data.totalOrders;
      this.totalRevenue = data.totalRevenue;
      this.topSellingArtworks = data.topSellingArtworks;
      this.customerDemographics = data.customerDemographics;

      this.revenueOverTime = data.revenueOverTime;
      this.ordersOverTime = data.ordersOverTime;
      this.storesOverTime = data.storesOverTime;

      this.prepareBarChart();
      this.preparePieChart();
      this.onTimePeriodChange(this.selectedTimePeriod)

      this.isLoading = false;
    },
      error: (error) => {
        console.error('Dashboard data fetch failed', error);
        this.isLoading = false;
      }
  });
}



timePeriods: string[] = ['monthly', 'quarterly', 'yearly'];

onTimePeriodChange(period: string): void {
  this.selectedTimePeriod = period;
  const labels = this.revenueOverTime[this.selectedTimePeriod].map((item: any) =>
    this.selectedTimePeriod === 'monthly' ? item.month : (item.quarter || item.year)
  );

  const revenueData = this.revenueOverTime[this.selectedTimePeriod].map((item: any) => item.revenue);
  const ordersData = this.ordersOverTime[this.selectedTimePeriod].map((item: any) => item.orders);
  const storesData = this.storesOverTime[this.selectedTimePeriod].map((item: any) => item.storesAdded);

  this.lineChartLabels = labels;

  // Chart 1: Revenue
  this.revenueChartData = [
    { data: revenueData, label: 'Revenue', borderColor: 'green', fill: false },
  ];

  // Chart 2: Orders and Stores
  this.ordersStoresChartData = [
    { data: ordersData, label: 'Orders', borderColor: 'blue', fill: false },
    { data: storesData, label: 'Stores Added', borderColor: 'red', fill: false },
  ];
}

prepareBarChart(): void {
  if(this.topSellingArtworks) {
  this.barChartLabels = this.topSellingArtworks.map((artwork: any) => artwork.name);
  this.barChartData = [
    {
      data: this.topSellingArtworks.map((artwork: any) => artwork.totalSales),
      label: 'Top Selling Artworks'
    }
  ];
}
  }

preparePieChart(): void {
  const demographicKeys: string[] = Object.keys(this.customerDemographics);
  const demographicValues: number[] = Object.values(this.customerDemographics) as number[];

  this.pieChartLabels = demographicKeys;
  this.pieChartData = [
    {
      data: demographicValues,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }
  ];
}
}

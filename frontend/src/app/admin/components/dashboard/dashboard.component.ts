import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../visitor/services/data.service';




interface MonthlyChange {
  value: number;
  percentage: number;
  trend: 'positive' | 'negative' | 'neutral';
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {



  currentPage: number = 1;
  changePage(page: number): void {
    if (page >= 1 && page <= 2) {
      this.currentPage = page;
    }
  }


  constructor(private adminService: AdminService) { }


  // Add these properties to your DashboardComponent class
  revenueChange: MonthlyChange = { value: 0, percentage: 0, trend: 'neutral' };
  ordersChange: MonthlyChange = { value: 0, percentage: 0, trend: 'neutral' };
  storesChange: MonthlyChange = { value: 0, percentage: 0, trend: 'neutral' };

  revenueOverTime: any;
  ordersOverTime: any;
  storesOverTime: any;
  totalStores: number | undefined;
  totalOrders: number | undefined;
  totalRevenue: number | undefined;
  topSellingArtworks: any[] | undefined;
  customerDemographics: any;

  selectedTimePeriod: string = 'monthly';
  timePeriods: string[] = ['monthly', 'quarterly', 'yearly'];

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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: "'Source Sans Pro', sans-serif",
            size: 14,
          },
          color: '#2c3e50'
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6c757d',
          font: {
            family: "'Source Sans Pro', sans-serif",
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6c757d',
          font: {
            family: "'Source Sans Pro', sans-serif",
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 10,
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(102, 126, 234, 0.9)'
      }
    }
  };
  barChartLegend = true;
  barChartType: ChartType = 'bar';

  pieChartData: ChartDataset[] = [];
  pieChartLabels: string[] = [];
  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Source Sans Pro', sans-serif",
            size: 14,
          },
          color: '#2c3e50'
        }
      },
      title: {
        display: false
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3
      }
    }
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
    hover: {}
  };


  private calculateMonthlyChanges(data: any): void {
    const calculateChange = (timeSeriesData: any, metric: string): MonthlyChange => {
      if (!timeSeriesData?.monthly || timeSeriesData.monthly.length < 2) {
        return { value: 0, percentage: 0, trend: 'neutral' };
      }

      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const sortedData = [...timeSeriesData.monthly].sort((a, b) =>
        months.indexOf(b.month) - months.indexOf(a.month)
      );

      const currentMonth = sortedData[0][metric];
      const previousMonth = sortedData[1][metric];
      const difference = currentMonth - previousMonth;
      const percentage = previousMonth !== 0 ? (difference / previousMonth) * 100 : 0;

      return {
        value: Math.abs(difference),
        percentage: Math.abs(percentage),
        trend: difference > 0 ? 'positive' : difference < 0 ? 'negative' : 'neutral'
      };
    };

    this.revenueChange = calculateChange(data.revenueOverTime, 'revenue');
    this.ordersChange = calculateChange(data.ordersOverTime, 'orders');
    this.storesChange = calculateChange(data.storesOverTime, 'storesAdded');
  }




  ngOnInit(): void {
    this.adminService.getAnalyticsData().subscribe({
      next: (data) => {

        // Update component properties with the transformed data
        this.totalStores = data.totalStores;
        this.totalOrders = data.totalOrders;
        this.totalRevenue = data.totalRevenue;
        this.topSellingArtworks = data.topSellingArtworks;
        this.customerDemographics = data.customerDemographics;

        this.revenueOverTime = data.revenueOverTime;
        this.ordersOverTime = data.ordersOverTime;
        this.storesOverTime = data.storesOverTime;

        // Prepare charts
        this.prepareBarChart();
        this.preparePieChart();
        this.onTimePeriodChange(this.selectedTimePeriod);

        this.calculateMonthlyChanges(data);


        this.isLoading = false;
      },
      error: (error) => {
        console.error('Analytics data fetch failed:', error);
        this.isLoading = false;
      }
    });
  }



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
      { data: revenueData, label: 'Revenue', borderColor: 'rgba(74, 222, 128, 0.7)', fill: false },
    ];

    // Chart 2: Orders and Stores
    this.ordersStoresChartData = [
      { data: ordersData, label: 'Orders', borderColor: 'rgba(102, 126, 234, 0.7)', fill: false },
      { data: storesData, label: 'Stores Added', borderColor: 'rgba(252, 165, 165, 0.7)', fill: false },
    ];
  }

  prepareBarChart(): void {
    if (this.topSellingArtworks) {
      const { backgroundColor, hoverBackgroundColor } = this.generatePieChartColors(this.topSellingArtworks.length);

      this.barChartLabels = this.topSellingArtworks.map((artwork: any) => artwork.name);
      this.barChartData = [
        {
          data: this.topSellingArtworks.map((artwork: any) => artwork.totalSales),
          label: 'Sold ',
          backgroundColor,
          hoverBackgroundColor,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: backgroundColor.map(color => color.replace('0.7)', '1)'))
        }
      ];
    }
  }


  generatePieChartColors(numCategories: number) {
    const baseColors = [
      'rgba(102, 126, 234, 0.7)',
      'rgba(74, 222, 128, 0.7)',
      'rgba(252, 165, 165, 0.7)',
      'rgba(249, 168, 212, 0.7)',
      'rgba(134, 239, 172, 0.7)',
      'rgba(147, 197, 253, 0.7)',
      'rgba(216, 180, 254, 0.7)',
      'rgba(253, 186, 116, 0.7)',
      'rgba(129, 140, 248, 0.7)',
      'rgba(96, 165, 250, 0.7)'
    ];

    // If more categories than base colors, cycle through or generate more
    const backgroundColor = baseColors.slice(0, numCategories);
    const hoverBackgroundColor = backgroundColor.map(color =>
      color.replace('0.7)', '0.9)')
    );

    return { backgroundColor, hoverBackgroundColor };
  }


  preparePieChart(): void {
    const demographicKeys: string[] = Object.keys(this.customerDemographics);
    const demographicValues: number[] = Object.values(this.customerDemographics) as number[];
    const { backgroundColor, hoverBackgroundColor } = this.generatePieChartColors(demographicKeys.length);

    this.pieChartLabels = demographicKeys;
    this.pieChartData = [
      {
        data: demographicValues,
        backgroundColor,
        hoverBackgroundColor
      }
    ];
  }


}

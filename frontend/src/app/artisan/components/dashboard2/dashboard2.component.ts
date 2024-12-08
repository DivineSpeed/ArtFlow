import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChartOptions } from 'chart.js';
import { ProductService } from '../../../products/services/product.service';

@Component({
  selector: 'app-dashboard2',
  standalone: true,
  imports: [],
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.css'
})
export class Dashboard2Component {
  data: any;
  verif = 0;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'idCommande',
    'dateCommande',
    'prixTotalCommande',
    'adresseLivraison',
    'ville',
    'codePostal',
    'pays',
    'numeroTelephone',
    'email',
    'items',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Bar Chart properties
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    
    borderColor: 'rgb(75, 192, 192)',
    
  };

  // Pie Chart properties
  pieChartLabels: string[] = [];
  pieChartData: any[] = [];
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
  };

  constructor(private _productService: ProductService) {}

  ngOnInit(): void {
    this._productService.getList().subscribe(
      (response) => {
        this.data = response;
        this.verif = 200;
        this.data = response;
        this.verif = 200;
        this.dataSource.data = this.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateBarChart(this.data);
        this.updatePieChart(this.data);
        
      },
      (err) => {
        console.error(err);
        this.verif = err.status;
        this.data = [];
      }
    );
  }

  updateBarChart(data: any[]): void {
    this.chartLabels = data.map((command) => `Commande ${command.idCommande}`);
    this.chartData = [
      {
        data: data.map((command) => command.prixTotalCommande),
        label: 'Total Price',
        backgroundColor: '#3f51b5',
        borderColor: '#3f51b5',
      },
    ];
  }

  updatePieChart(data: any[]): void {
    const productQuantities: { [key: string]: number } = {};
    data.forEach((command) => {
      command.panier.items.forEach((item : any) => {
        const productName = item.produit.nomProduit;
        productQuantities[productName] =
          (productQuantities[productName] || 0) + item.quantite;
      });
    });

    this.pieChartLabels = Object.keys(productQuantities);
    this.pieChartData = [
      {
        data: Object.values(productQuantities),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ];
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  expandedRow: any = null;
  toggleRow(row: any): void {
    this.expandedRow = this.expandedRow === row ? null : row;
  }

  isRowExpanded(row: any): boolean {
    return this.expandedRow === row;
  }

}

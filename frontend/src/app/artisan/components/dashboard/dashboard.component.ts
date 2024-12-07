import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts'; // Import NgChartsModule
import { FooterComponent } from '../../../layout/components/footer/footer.component';
import { HeaderComponent } from '../../../layout/components/header/header.component';
import { ProductService } from '../../../products/services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports:[MatTable,MatIconModule , MatTooltipModule,MatPaginatorModule,MatSortModule ,MatFormField,MatLabel,MatSelect,MatOption,CommonModule, MatTableModule, MatSortModule,HeaderComponent,BaseChartDirective,MatButtonModule,FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
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
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, matFormFieldAnimations, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { FooterComponent } from '../../../layout/components/footer/footer.component';
import { HeaderComponent } from '../../../layout/components/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatFormField,MatLabel,MatSelect,MatOption,CommonModule, MatTableModule, MatSortModule,HeaderComponent,BaseChartDirective,MatButtonModule,FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  commands = [
    {
      idCommande: 101,
      dateCommande: '2024-12-01',
      prixTotalCommande: 120.5,
      adresseLivraison: '123 Main Street, Tunis',
      status: 'Delivered', // Default status
    },
    {
      idCommande: 102,
      dateCommande: '2024-12-02',
      prixTotalCommande: 250.0,
      adresseLivraison: '456 Elm Street, Sfax',
      status: 'In Progress', // Default status
    },
    {
      idCommande: 103,
      dateCommande: '2024-12-03',
      prixTotalCommande: 320.75,
      adresseLivraison: '789 Oak Street, Nabeul',
      status: 'waiting', // Default status
    },
  ];
  

  // Chart Data
  chartLabels = ['Commande 101', 'Commande 102', 'Commande 103'];
  chartData = [
    {
      data: [120.5, 250.0, 320.75],
      label: 'Total Price',
      backgroundColor: '#3f51b5',
      borderColor: '#3f51b5',
    },
  ];
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  updateStatus(command: any, newStatus: string): void {
    const confirmation = confirm(
      `Are you sure you want to change the status of Command ${command.idCommande} to "${newStatus}"?`
    );
    if (confirmation) {
      command.status = newStatus;
    }
  }
  

  // Get Status Class for Styling
  getStatusClass(status: string): string {
    if (status === 'Delivered') {
      return 'text-success';
    } else if (status === 'In Progress') {
      return 'text-warning';
    } else if (status === 'waiting') {
      return 'text-danger';
    }
    return '';
  }
  
}

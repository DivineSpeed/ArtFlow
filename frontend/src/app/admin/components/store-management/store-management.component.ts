import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';

// Import the dialog component
import { StoreDetailsDialogComponent } from '../store-details-dialog/store-details-dialog.component';

// Use the Store interface from the service
import { Store } from '../../services/store.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-store-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule],
  templateUrl: './store-management.component.html',
  styleUrl: './store-management.component.css'
})
export class StoreManagementComponent implements OnInit {


  // ViewChild decorators to access Paginator and Sort
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  // Sorting options
  sortOptions = [
    { value: 'totalArtworksListed', viewValue: 'Total Artworks' },
    { value: 'totalSales', viewValue: 'Total Sales' },
    { value: 'totalRevenue', viewValue: 'Total Revenue' },
    { value: 'nomBoutique', viewValue: 'Store Name' }
  ];

  // Selected sort option
  selectedSortOption: string = 'totalRevenue';

  displayedColumns: string[] = [
    'idBoutique',
    'nomBoutique',
    'artisanName',
    'totalArtworksListed',
    'totalSales',
    'totalRevenue',
    'actions'
  ];

  // Use MatTableDataSource with the Store type
  dataSource = new MatTableDataSource<Store>([]);

  constructor(
    private storeService: StoreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar // Injecting snack bar service for feedback

  ) { }

  ngOnInit() {
    this.loadStores();
  }

  ngAfterViewInit() {
    // Setup paginator and sort after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStores() {
    this.storeService.getAllStores().subscribe({
      next: (stores: Store[]) => {
        this.dataSource.data = stores;

        // Custom sorting data accessor
        this.dataSource.sortingDataAccessor = (item: Store, property: string): string | number => {
          switch (property) {
            case 'artisanName':
              return item.artisan.nomArtisan;
            case 'totalArtworksListed':
              return item.totalArtworksListed || 0;
            case 'totalSales':
              return item.totalSales || 0;
            case 'totalRevenue':
              return item.totalRevenue || 0;
            case 'nomBoutique':
              return item.nomBoutique;
            default:
              return (item as any)[property] || '';
          }
        };

        // Ensure sort is available and configured
        if (this.sort) {
          this.sort.active = this.selectedSortOption;
          this.sort.direction = 'desc';
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error fetching stores:', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    // Reset to first page after filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewStoreDetails(store: any): void {
    const dialogRef = this.dialog.open(StoreDetailsDialogComponent, {
      maxHeight: '90vh', // Keep max height to avoid overflowing vertically
      data: store // Pass the store data
    });
  }

  deleteStore(store: Store): void {
    // Confirmation prompt before deleting
    if (confirm(`Are you sure you want to delete the store "${store.nomBoutique}"?`)) {
      this.storeService.deleteStore(store.idBoutique).subscribe({
        next: () => {
          // Remove the store from the table after successful deletion
          this.dataSource.data = this.dataSource.data.filter(item => item.idBoutique !== store.idBoutique);
          this.snackBar.open('Store deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting store:', error);
          this.snackBar.open('Failed to delete store', 'Close', { duration: 3000 });
        }
      });
    }
  }



  // Method to handle sort option change
  onSortOptionChange() {
    if (this.sort) {
      this.sort.active = this.selectedSortOption;
      this.sort.sortChange.emit();
    }
  }
}
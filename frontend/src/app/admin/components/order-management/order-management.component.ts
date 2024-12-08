import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService, Order, StatusPriority } from '../../services/order.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule
  ],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})



export class OrderManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  selectedOrder: Order | null = null;

  currentItemIndex = 0;

  nextItem() {
    if (this.selectedOrder && this.selectedOrder.panier.items) {
      this.currentItemIndex = (this.currentItemIndex + 1) % this.selectedOrder.panier.items.length;
    }
  }

  prevItem() {
    if (this.selectedOrder && this.selectedOrder.panier.items) {
      this.currentItemIndex = (this.currentItemIndex - 1 + this.selectedOrder.panier.items.length) % this.selectedOrder.panier.items.length;
    }
  }

  setCurrentItem(index: number) {
    this.currentItemIndex = index;
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.currentItemIndex = 0; // Reset carousel to first item
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
    this.currentItemIndex = 0;
  }



  // Sorting options adjusted to match the detailed Order interface
  sortOptions = [
    { value: 'dateCommande', viewValue: 'Order Date' },
    { value: 'prixTotalCommande', viewValue: 'Total Amount' },
    { value: 'orderStatus', viewValue: 'Order Status' } // New sort option
  ];

  selectedSortOption: string = 'dateCommande';

  displayedColumns: string[] = [
    'idCommande',
    'customerName',
    'dateCommande',
    'prixTotalCommande',
    'itemCount',
    'orderStatus', // Add this new column
    'actions'
  ];

  // Use MatTableDataSource with the Order type
  dataSource = new MatTableDataSource<Order>([]);
  router: any;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  ngAfterViewInit() {
    // Setup paginator and sort after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  statusPriority: StatusPriority = {
    'PENDING': 1,
    'PROCESSING': 2,
    'SHIPPED': 3,
    'UNKNOWN': 5
  };


  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        // Pre-compute status for all orders to avoid multiple API calls
        this.dataSource.data = orders.map(order => {
          const currentDate = new Date();
          const orderDate = new Date(order.dateCommande);
          const daysSinceOrder = (currentDate.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);

          return {
            ...order,
            orderStatus: this.determineOrderStatus(daysSinceOrder)
          };
        });

        this.dataSource.sortingDataAccessor = (item: Order & { orderStatus?: string }, property: string): string | number => {
          switch (property) {
            case 'dateCommande':
              return new Date(item.dateCommande).getTime();
            case 'prixTotalCommande':
              return item.prixTotalCommande || 0;
            case 'customerName':
              return `${item.nomVisiteur} ${item.prenomVisiteur}`;
            case 'orderStatus':
              // Use the defined type with a fallback
              return this.statusPriority[item.orderStatus || 'UNKNOWN'] || 5;
            default:
              return (item as any)[property] || '';
          }
        };

        // Custom filtering
        this.dataSource.filterPredicate = (data: Order, filter: string) => {
          const searchString = `${data.idCommande} ${data.nomVisiteur} ${data.prenomVisiteur} ${data.email} ${data.dateCommande}`
            .toLowerCase();
          return searchString.includes(filter);
        };

        // Ensure sort is available and configured
        if (this.sort) {
          this.sort.active = this.selectedSortOption;
          this.sort.direction = 'desc';
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 });
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

  /*(WIP) deleteOrder(order: Order): void {
    if (confirm(`Are you sure you want to delete the order #${order.idCommande}?`)) {
      this.orderService.deleteOrder(order.idCommande).subscribe({
        next: () => {
          // Remove the order from the table after successful deletion
          this.dataSource.data = this.dataSource.data.filter(item => item.idCommande !== order.idCommande);
          this.snackBar.open('Order deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.snackBar.open('Failed to delete order', 'Close', { duration: 3000 });
        }
      });
    }
  }*/

  // Helper methods
  formatOrderDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getItemCount(order: Order): number {
    return order.panier?.items?.reduce((total, item) => total + item.quantite, 0) || 0;
  }

  onSortOptionChange() {
    if (this.sort) {
      this.sort.active = this.selectedSortOption;
      this.sort.sortChange.emit();
    }
  }

  determineOrderStatus(daysSinceOrder: number): string {
    if (daysSinceOrder < 1) return 'PENDING';
    if (daysSinceOrder < 7) return 'PROCESSING';
    return 'Shipped'
  }


}
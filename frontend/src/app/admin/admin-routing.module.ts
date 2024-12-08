import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { authGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '', /*canActivate: [authGuard],*/
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, /*canActivate: [authGuard]*/ },
      { path: 'orders', component: OrderManagementComponent, /*canActivate: [authGuard]*/ },
      { path: 'stores', component: StoreManagementComponent, /*canActivate: [authGuard]*/ },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

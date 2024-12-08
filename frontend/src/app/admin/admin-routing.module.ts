import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { roleGuard } from '../guards/role.guard';
import { authGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent ,  canActivate: [roleGuard] },
      { path: 'orders', component: OrderManagementComponent ,canActivate: [roleGuard]},
      { path: 'stores', component: StoreManagementComponent ,canActivate: [roleGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { CartItemComponent } from './cart/components/cart-item/cart-item.component';
import { CheckoutComponent } from './cart/components/checkout/checkout.component';
import { HomeComponent } from './visitor/components/home/home.component';
import { OrderSummaryComponent } from './cart/components/order-summary/order-summary.component';


export const routes: Routes = [
  { path: 'artisan', loadChildren: () => import('./artisan/artisan.module').then(m => m.ArtisanModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'login', component: LoginComponent },
  { path: 'Signin', component: RegisterComponent },
  { path: 'home', component:  HomeComponent},
  { path: 'cart', component: CartItemComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thank-you', component: OrderSummaryComponent }
  
];
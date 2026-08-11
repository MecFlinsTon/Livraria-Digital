import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProductDetailComponent } from './components/product-detail.component';
import { CheckoutComponent } from './components/checkout.component';
import { AdminComponent } from './components/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];

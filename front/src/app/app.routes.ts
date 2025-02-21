import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';
import { roleGuard } from './auth/guards/role.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './dashboard/main/main.component';
import { CreateInvoiceComponent } from './invoices/create-invoice/create-invoice.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard],
  },
  {
    path: '',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent
      },
      {
        path: 'shopping-cart',
        component: CreateInvoiceComponent,
        canActivate: [roleGuard],
        data: { role: 'user' }
      },
      {
        path: 'users',
        loadChildren: () => import('./users/user.routes').then(m => m.USER_ROUTES),
        canActivate: [roleGuard],
        data: { role: 'admin' }
      },
      {
        path: 'products',
        loadChildren: () => import('./products/product.routes').then(m => m.PRODUCT_ROUTES)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./invoices/invoice.routes').then(m => m.INVOICE_ROUTES)
      }
    ]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
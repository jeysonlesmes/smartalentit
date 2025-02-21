import { Routes } from '@angular/router';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { roleGuard } from '../auth/guards/role.guard';

export const PRODUCT_ROUTES: Routes = [
  { path: '', component: ProductListComponent },
  {
    path: 'create',
    component: CreateProductComponent,
    canActivate: [roleGuard],
    data: { role: 'admin' }
  },
  { path: ':id', component: ProductDetailComponent }
];
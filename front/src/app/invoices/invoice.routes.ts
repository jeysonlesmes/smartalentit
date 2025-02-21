import { Routes } from '@angular/router';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

export const INVOICE_ROUTES: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: ':id', component: InvoiceDetailComponent }
];
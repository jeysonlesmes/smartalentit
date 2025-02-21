import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { baseApiUrl, PATHS } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { objectToQueryParams } from '../../shared/utils/http.utils';
import { CreateInvoice } from '../interfaces/create-invoice.interface';
import { InvoiceFilters } from '../interfaces/invoice-filters.interface';
import { Invoice } from '../interfaces/invoice.interface';
import { Summary } from '../interfaces/summary.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(
    private readonly http: HttpClient
  ) { }

  getInvoices(filters: InvoiceFilters, byUser: boolean = false): Observable<PaginatedResult<Invoice>> {
    const params = objectToQueryParams(filters);
    const url = `${baseApiUrl}${PATHS.INVOICE.URL}${byUser ? PATHS.INVOICE.BY_USER : ''}?${params}`;

    return this.http.get<ApiResponse<PaginatedResult<Invoice>>>(url).pipe(map(response => response.data!));
  }

  createInvoice(invoice: CreateInvoice): Observable<Invoice> {
    const url = `${baseApiUrl}${PATHS.INVOICE.URL}`;

    return this.http.post<ApiResponse<Invoice>>(url, invoice).pipe(map(response => response.data!));
  }

  getInvoiceById(id: string): Observable<Invoice | null> {
    const url = `${baseApiUrl}${PATHS.INVOICE.URL}/${id}`;

    return this.http.get<ApiResponse<Invoice | null>>(url).pipe(map(response => response.data!));
  }

  getSummary(userId: string): Observable<Summary> {
    const url = `${baseApiUrl}${PATHS.INVOICE.URL}${PATHS.INVOICE.ANALYTICS.URL}${PATHS.INVOICE.ANALYTICS.PURCHASES_LAST_MONTH}?userId=${userId}`;

    return this.http.get<ApiResponse<Summary>>(url).pipe(map(response => response.data!));
  }
}

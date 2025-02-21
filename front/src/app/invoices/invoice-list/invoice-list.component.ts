import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { SharedModule } from '../../shared/modules/shared.module';
import { getEndOfDay, getStartOfDay, getUtcDate } from '../../shared/utils/date.utils';
import { InvoiceFilters } from '../interfaces/invoice-filters.interface';
import { Invoice } from '../interfaces/invoice.interface';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {
  public invoices: PaginatedResult<Invoice> = {} as PaginatedResult<Invoice>;
  public defaultPageIndex: number = 1;
  public defaultPageSize: number = 10;
  public tableInitialized: boolean = false;
  public filters: InvoiceFilters = {} as InvoiceFilters;
  public filterDate: Date[] = [];

  disableFutureDates = (current: Date): boolean => {
    return current > new Date();
  };

  private requestSubscriber: Subscription | null = null;

  constructor(
    private readonly invoiceService: InvoiceService,
    public readonly authService: AuthService
  ) { }

  ngOnInit() {
    this.filters = {
      pageSize: this.defaultPageSize,
      pageIndex: this.defaultPageIndex
    };

    this.loadData();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (!this.tableInitialized) {
      this.tableInitialized = true;
      return;
    }

    this.filters.pageIndex = params.pageIndex || this.defaultPageIndex;
    this.filters.pageSize = params.pageSize || this.defaultPageSize;

    if (this.requestSubscriber) {
      this.requestSubscriber.unsubscribe();
    }

    this.loadInvoices();
  }

  clearFilters(): void {
    this.filters.user = undefined;
    this.filters.product = undefined;
    this.filters.minPrice = undefined;
    this.filters.maxPrice = undefined;
    this.filters.startDate = undefined;
    this.filters.endDate = undefined;
    this.filterDate = [];

    this.loadInvoices(true);
  }

  loadInvoices(resetPagination: boolean = false) {
    if (resetPagination) {
      this.filters.pageIndex = this.defaultPageIndex;
    }

    if (this.filterDate && this.filterDate.length > 0) {
      this.filters.startDate = getUtcDate(getStartOfDay(this.filterDate[0]));
      this.filters.endDate = getUtcDate(getEndOfDay(this.filterDate[1]));
    }

    if (!this.filterDate.length) {
      this.filters.startDate = undefined;
      this.filters.endDate = undefined;
    }

    this.requestSubscriber = this.invoiceService.getInvoices(this.filters, !this.authService.isAdmin()).subscribe({
      next: (response: PaginatedResult<Invoice>) => {
        this.invoices = response;
        this.requestSubscriber = null;
      },
      error: (error: HttpErrorResponse) => {
        this.requestSubscriber = null;
        console.error(error);
      }
    });
  }

  private loadData() {
    this.loadInvoices();
  }
}

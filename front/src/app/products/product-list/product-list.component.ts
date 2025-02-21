import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { SharedModule } from '../../shared/modules/shared.module';
import { ProductFilters } from '../interfaces/product-filters.interface';
import { Product } from '../interfaces/product.interface';
import { Status } from '../interfaces/status.interface';
import { ProductService } from '../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ShoppingCartService } from '../../invoices/services/shopping-cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  public products: PaginatedResult<Product> = {} as PaginatedResult<Product>;
  public defaultPageIndex: number = 1;
  public defaultPageSize: number = 10;
  public tableInitialized: boolean = false;
  public filters: ProductFilters = {} as ProductFilters;
  public statuses: Status[] = [];

  private requestSubscriber: Subscription | null = null;

  constructor(
    private readonly productService: ProductService,
    public readonly authService: AuthService,
    public readonly shoppingCartService: ShoppingCartService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.filters = {
      pageSize: this.defaultPageSize,
      pageIndex: this.defaultPageIndex
    };

    if (!this.authService.isAdmin()) {
      this.filters.statuses = ['active'];
      this.filters.minStock = 1;
    }

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

    this.loadProducts();
  }

  clearFilters(): void {
    this.filters.name = undefined;
    this.filters.minStock = undefined;
    this.filters.statuses = undefined;
    this.filters.minPrice = undefined;
    this.filters.maxPrice = undefined;

    this.loadProducts(true);
  }

  loadProducts(resetPagination: boolean = false) {
    if (resetPagination) {
      this.filters.pageIndex = this.defaultPageIndex;
    }

    this.requestSubscriber = this.productService.getProducts(this.filters).subscribe({
      next: (response: PaginatedResult<Product>) => {
        this.products = response;
        this.requestSubscriber = null;
      },
      error: (error: HttpErrorResponse) => {
        this.requestSubscriber = null;
        console.error(error);
      }
    });
  }

  goToShoppingCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  private loadData() {
    this.productService.getStatuses().subscribe(statuses => {
      this.statuses = statuses;
    });

    this.loadProducts();
  }
}

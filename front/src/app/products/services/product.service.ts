import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { baseApiUrl, PATHS } from '../../../environments/environment';
import { ApiResponse } from '../../shared/interfaces/api-response.interface';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { objectToQueryParams } from '../../shared/utils/http.utils';
import { CreateProduct, UpdateProduct } from '../interfaces/product-data.interface';
import { ProductFilters } from '../interfaces/product-filters.interface';
import { Product } from '../interfaces/product.interface';
import { Status } from '../interfaces/status.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private readonly http: HttpClient
  ) { }

  getProducts(filters: ProductFilters): Observable<PaginatedResult<Product>> {
    const params = objectToQueryParams(filters);
    const url = `${baseApiUrl}${PATHS.PRODUCT.URL}?${params}`;

    return this.http.get<ApiResponse<PaginatedResult<Product>>>(url).pipe(map(response => response.data!));
  }

  getProductById(id: string): Observable<Product | null> {
    const url = `${baseApiUrl}${PATHS.PRODUCT.URL}/${id}`;

    return this.http.get<ApiResponse<Product | null>>(url).pipe(map(response => response.data!));
  }

  createProduct(product: CreateProduct): Observable<Product> {
    const url = `${baseApiUrl}${PATHS.PRODUCT.URL}`;

    return this.http.post<ApiResponse<Product>>(url, product).pipe(map(response => response.data!));
  }

  updateProduct(product: UpdateProduct): Observable<Product> {
    const url = `${baseApiUrl}${PATHS.PRODUCT.URL}`;

    return this.http.put<ApiResponse<Product>>(url, product).pipe(map(response => response.data!));
  }

  deleteProduct(id: string): Observable<void> {
    const url = `${baseApiUrl}${PATHS.PRODUCT.URL}/${id}`;

    return this.http.delete<ApiResponse<Product | null>>(url).pipe(map(() => void 0));
  }

  getStatuses(): Observable<Status[]> {
    const url = `${baseApiUrl}${PATHS.PRODUCT.URL}${PATHS.PRODUCT.STATUS.URL}`;

    return this.http.get<ApiResponse<Status[]>>(url).pipe(map(response => response.data!));
  }
}

import { Pagination } from "../../shared/interfaces/pagination.interface";

export interface ProductFilters extends Pagination {
  name?: string;
  minStock?: number;
  minPrice?: number;
  maxPrice?: number;
  statuses?: string[];
}
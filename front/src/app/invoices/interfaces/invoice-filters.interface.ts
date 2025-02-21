import { Pagination } from "../../shared/interfaces/pagination.interface";

export interface InvoiceFilters extends Pagination {
  user?: string;
  product?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
}
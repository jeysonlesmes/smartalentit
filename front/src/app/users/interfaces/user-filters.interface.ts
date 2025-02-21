import { Pagination } from "../../shared/interfaces/pagination.interface";

export interface UserFilters extends Pagination {
  name?: string;
  email?: string;
  roles?: string[];
}
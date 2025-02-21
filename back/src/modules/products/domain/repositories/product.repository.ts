import { Product } from "@products/domain/entities/product.entity";
import { BaseRepository } from "@shared/domain/repositories/base.repository";

export abstract class ProductRepository extends BaseRepository<Product> {
  abstract findPaginated(filters: {
    pageIndex: number;
    pageSize: number;
    name?: string;
    statuses?:
    string[];
    minStock?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ total: number; items: Product[]; }>;
}
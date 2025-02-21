import { Invoice } from "@invoices/domain/entities/invoice.entity";
import { BaseRepository } from "@shared/domain/repositories/base.repository";

export abstract class InvoiceRepository extends BaseRepository<Invoice> {
  abstract findPaginated(filters: {
    pageIndex: number;
    pageSize: number;
    userId: string | null;
    userName: string | null;
    productName: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
  }): Promise<{ total: number; items: Invoice[]; }>;

  abstract getSummaryByUser(filters: { userId: string; startDate: Date; endDate: Date; }): Promise<{ total: number; amount: number; }>;
}
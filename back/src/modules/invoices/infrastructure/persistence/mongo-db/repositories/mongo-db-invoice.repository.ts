import { Invoice } from "@invoices/domain/entities/invoice.entity";
import { InvoiceRepository } from "@invoices/domain/repositories/invoice.repository";
import { InvoiceMapper } from "@invoices/infrastructure/persistence/mongo-db/mappers/invoice.mapper";
import { Invoice as InvoiceDocument } from "@invoices/infrastructure/persistence/mongo-db/schemas/invoice.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { Model } from "mongoose";

export class MongoDbInvoiceRepository extends InvoiceRepository {
  constructor(
    @InjectModel(InvoiceDocument.name)
    private readonly model: Model<InvoiceDocument>
  ) {
    super();
  }

  async getAll(): Promise<Invoice[]> {
    const invoices = await this.model.find().exec();

    return invoices.map(InvoiceMapper.toDomain);
  }

  async save(entity: Invoice): Promise<void> {
    await this.model.findOneAndUpdate(
      { invoiceId: entity.id.value() },
      InvoiceMapper.toPersistence(entity),
      { upsert: true }
    ).exec();
  }

  async findOneById(id: Uuid): Promise<Invoice | null> {
    const invoice = await this.model.findOne({ invoiceId: id.value() }).exec();

    if (!invoice) {
      return null;
    }

    return InvoiceMapper.toDomain(invoice);
  }

  async delete(id: Uuid): Promise<void> {
    await this.model.deleteOne({ invoiceId: id.value() }).exec();
  }

  async findPaginated({
    pageIndex,
    pageSize,
    userId,
    userName,
    productName,
    minPrice,
    maxPrice,
    startDate,
    endDate
  }: {
    pageIndex: number;
    pageSize: number;
    userId: string | null;
    userName: string | null;
    productName: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    startDate: Date | null;
    endDate: Date | null;
  }): Promise<{ total: number; items: Invoice[]; }> {
    const skip = (pageIndex - 1) * pageSize;

    const filter: any = {};

    if (userId) {
      filter['user.id'] = userId;
    }

    if (userName) {
      filter['user.name'] = { $regex: userName, $options: 'i' };
    }

    if (productName) {
      filter['products.name'] = { $regex: productName, $options: 'i' };
    }

    if (minPrice !== null) {
      filter.total = { $gte: minPrice };
    }

    if (maxPrice !== null) {
      filter.total = { $lte: maxPrice, ...(filter.total ?? {}) };
    }

    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }

    if (endDate) {
      filter.createdAt = { $lte: endDate, ...(filter.createdAt ?? {}) };
    }

    const [products, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(pageSize).sort({ _id: -1 }).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return {
      total,
      items: products.map(InvoiceMapper.toDomain)
    };
  }

  async getSummaryByUser({ userId, startDate, endDate }: { userId: string; startDate: Date; endDate: Date; }): Promise<{ total: number; amount: number; }> {
    const summary = await this.model.aggregate([
      {
        $match: {
          'user.id': userId,
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          amount: { $sum: '$total' }
        }
      }
    ]).exec();

    if (!summary.length) {
      return {
        total: 0,
        amount: 0
      };
    }

    return {
      total: summary[0].total,
      amount: summary[0].amount
    };
  }
}
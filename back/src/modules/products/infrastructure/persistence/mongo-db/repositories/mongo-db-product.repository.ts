import { InjectModel } from "@nestjs/mongoose";
import { Product } from "@products/domain/entities/product.entity";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { ProductMapper } from "@products/infrastructure/persistence/mongo-db/mappers/product.mapper";
import { Product as ProductDocument } from "@products/infrastructure/persistence/mongo-db/schemas/product.schema";
import { Model } from "mongoose";

export class MongoDbProductRepository extends ProductRepository {
  constructor(
    @InjectModel(ProductDocument.name)
    private readonly model: Model<ProductDocument>
  ) {
    super();
  }

  async getAll(): Promise<Product[]> {
    const products = await this.model.find().exec();

    return products.map(ProductMapper.toDomain);
  }

  async save(entity: Product): Promise<void> {
    await this.model.findOneAndUpdate(
      { productId: entity.id.value() },
      ProductMapper.toPersistence(entity),
      { upsert: true }
    ).exec();
  }

  async findOneById(id: ProductId): Promise<Product | null> {
    const product = await this.model.findOne({ productId: id.value() }).exec();

    if (!product) {
      return null;
    }

    return ProductMapper.toDomain(product);
  }

  async delete(id: ProductId): Promise<void> {
    await this.model.deleteOne({ productId: id.value() }).exec();
  }

  async findPaginated({
    pageIndex,
    pageSize,
    name,
    statuses,
    minStock,
    minPrice,
    maxPrice
  }: {
    pageIndex: number;
    pageSize: number;
    name?: string;
    statuses?: string[];
    minStock?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ total: number; items: Product[]; }> {
    const skip = (pageIndex - 1) * pageSize;

    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (statuses?.length) {
      filter['status.code'] = { $in: statuses };
    }

    if (minStock) {
      filter.stock = { $gte: minStock };
    }

    if (minPrice !== undefined) {
      filter.price = { $gte: minPrice };
    }

    if (maxPrice !== undefined) {
      filter.price = { $lte: maxPrice, ...(filter.price ?? {}) };
    }

    const [products, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(pageSize).sort({ _id: -1 }).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return {
      total,
      items: products.map(ProductMapper.toDomain)
    };
  }
}
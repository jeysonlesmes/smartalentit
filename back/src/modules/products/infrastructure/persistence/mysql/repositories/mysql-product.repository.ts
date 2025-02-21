import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "@products/domain/entities/product.entity";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { ProductId } from "@products/domain/value-objects/product-id.vo";
import { Product as ProductEntity } from "@products/infrastructure/persistence/mysql/entities/product.entity";
import { ProductMapper } from "@products/infrastructure/persistence/mysql/mappers/product.mapper";
import { Repository } from "typeorm";

export class MysqlProductRepository extends ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {
    super();
  }

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: {
        status: true
      }
    });

    return products.map(ProductMapper.toDomain);
  }

  async save(entity: Product): Promise<void> {
    const product = ProductMapper.toPersistence(entity);

    await this.productRepository.save(product);
  }

  async findOneById(id: ProductId): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: {
        id: id.value()
      },
      relations: {
        status: true
      }
    });

    if (!product) {
      return null;
    }

    return ProductMapper.toDomain(product);
  }

  async delete(id: ProductId): Promise<void> {
    await this.productRepository.delete({ id: id.value() })
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
  }): Promise<{ total: number; items: Product[] }> {
    const skip = (pageIndex - 1) * pageSize;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.status', 'status');

    if (name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    if (statuses?.length) {
      queryBuilder.andWhere('status.name IN (:...statuses)', { statuses });
    }

    if (minStock) {
      queryBuilder.andWhere('product.stock >= :minStock', { minStock });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return {
      total,
      items: products.map(ProductMapper.toDomain),
    };
  }
}
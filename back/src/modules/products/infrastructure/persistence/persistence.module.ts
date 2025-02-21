import { Module } from "@nestjs/common";
import { ProductRepository } from "@products/domain/repositories/product.repository";
import { StatusRepository } from "@products/domain/repositories/status.repository";
import { InMemoryStatusRepository } from "@products/infrastructure/persistence/in-memory/repositories/in-memory-status.repository";
import { MongoDbModule } from "@products/infrastructure/persistence/mongo-db/mongo-db.module";
import { MongoDbProductRepository } from "@products/infrastructure/persistence/mongo-db/repositories/mongo-db-product.repository";

@Module({
  imports: [
    MongoDbModule
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: MongoDbProductRepository
    },
    {
      provide: StatusRepository,
      useClass: InMemoryStatusRepository
    }
  ],
  exports: [
    ProductRepository,
    StatusRepository
  ]
})
export class PersistenceModule { }
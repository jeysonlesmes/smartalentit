import { InvoiceRepository } from "@invoices/domain/repositories/invoice.repository";
import { MongoDbModule } from "@invoices/infrastructure/persistence/mongo-db/mongo-db.module";
import { MongoDbInvoiceRepository } from "@invoices/infrastructure/persistence/mongo-db/repositories/mongo-db-invoice.repository";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MongoDbModule
  ],
  providers: [
    {
      provide: InvoiceRepository,
      useClass: MongoDbInvoiceRepository
    }
  ],
  exports: [
    InvoiceRepository
  ]
})
export class PersistenceModule { }
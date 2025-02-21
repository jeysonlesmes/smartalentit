import { Invoice, InvoiceSchema } from "@invoices/infrastructure/persistence/mongo-db/schemas/invoice.schema";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_DB_URL')
        }
      }
    }),
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class MongoDbModule { }
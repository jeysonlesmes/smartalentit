import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "@products/infrastructure/persistence/mongo-db/schemas/product.schema";

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
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class MongoDbModule { }
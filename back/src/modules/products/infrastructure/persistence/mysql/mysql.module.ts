import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "@products/infrastructure/persistence/mysql/entities/product.entity";
import { Status } from "@products/infrastructure/persistence/mysql/entities/status.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('MYSQL_DB_TYPE') as any,
        host: configService.get<string>('MYSQL_DB_HOST'),
        port: parseInt(configService.get<string>('MYSQL_DB_PORT')),
        username: configService.get<string>('MYSQL_DB_USERNAME'),
        password: configService.get<string>('MYSQL_DB_PASSWORD'),
        database: configService.get<string>('MYSQL_DB_DATABASE'),
        synchronize: false,
        logging: (configService.get<string>('MYSQL_DB_LOGGING') ?? 'false').toLowerCase() === 'true',
        entities: [Product, Status]
      })
    }),
    TypeOrmModule.forFeature([
      Product
    ])
  ],
  exports: [
    TypeOrmModule
  ]
})
export class MysqlModule { }
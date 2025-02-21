import { AuthModule } from '@auth/auth.module';
import { InvoiceModule } from '@invoices/invoice.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from '@products/product.module';
import { CommandQueryBusModule } from '@shared/modules/command-query-bus.module';
import { UserModule } from '@users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommandQueryBusModule.forRoot(),
    UserModule,
    AuthModule,
    ProductModule,
    InvoiceModule
  ]
})
export class AppModule { }

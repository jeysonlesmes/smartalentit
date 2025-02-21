import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CreateProductHandler } from '@products/application/use-cases/create-product/create-product.handler';
import { DeleteProductHandler } from '@products/application/use-cases/delete-product/delete-product.handler';
import { GetAllProductsHandler } from '@products/application/use-cases/get-all-products/get-all-products.handler';
import { GetAllStatusesHandler } from '@products/application/use-cases/get-all-statuses/get-all-statuses.handler';
import { GetProductByIdHandler } from '@products/application/use-cases/get-product-by-id/get-product-by-id.handler';
import { UpdateProductHandler } from '@products/application/use-cases/update-product/update-product.handler';
import { InfrastructureModule } from '@products/infrastructure/infrastructure.module';

@Module({
  imports: [
    InfrastructureModule,
    RouterModule.register([
      {
        path: 'products',
        module: InfrastructureModule
      }
    ])
  ],
  providers: [
    CreateProductHandler,
    GetAllProductsHandler,
    GetProductByIdHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    GetAllStatusesHandler
  ]
})
export class ProductModule { }
import { AdminRoleGuard } from '@auth/infrastructure/guards/admin-role.guard';
import { Controller, DefaultValuePipe, Delete, Get, Param, ParseFloatPipe, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductDto } from '@products/application/dtos/product.dto';
import { CreateProductCommand } from '@products/application/use-cases/create-product/create-product.command';
import { DeleteProductCommand } from '@products/application/use-cases/delete-product/delete-product.command';
import { GetAllProductsQuery } from '@products/application/use-cases/get-all-products/get-all-products.query';
import { GetProductByIdQuery } from '@products/application/use-cases/get-product-by-id/get-product-by-id.query';
import { UpdateProductCommand } from '@products/application/use-cases/update-product/update-product.command';
import { CreateProductDto, CreateProductSchema } from '@products/infrastructure/schemas/create-product.schema';
import { UpdateProductDto, UpdateProductSchema } from '@products/infrastructure/schemas/update-product.schema';
import { PaginatedResultDto } from '@shared/application/dtos/paginated-result.dto';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { Logger } from '@shared/application/ports/outbound/logger.port';
import { Body } from '@shared/infrastructure/decorators/body.decorator';
import { MaxPageIndexPipe } from '@shared/infrastructure/pipes/max-page-index.pipe';
import { MinPageIndexPipe } from '@shared/infrastructure/pipes/min-page-index.pipe';
import { OptionalParseFloatPipe } from '@shared/infrastructure/pipes/optional-parse-float.pipe';

@Controller()
export class ProductController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    private readonly logger: Logger
  ) { }

  @Post('/')
  @UseGuards(AdminRoleGuard)
  create(@Body(CreateProductSchema) request: CreateProductDto): Promise<ProductDto> {
    this.logger.info('creating product');
    
    return this.commandQueryBus.send<CreateProductCommand, ProductDto>(
      new CreateProductCommand(
        request.name,
        request.description,
        request.price,
        request.stock,
        request.status
      )
    );
  }

  @Get('/')
  async getAll(
    @Query('pageIndex', new DefaultValuePipe(1), MinPageIndexPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', new DefaultValuePipe(10), MaxPageIndexPipe, ParseIntPipe) pageSize: number,
    @Query('name') name?: string,
    @Query('statuses') statuses?: string[],
    @Query('minStock', new DefaultValuePipe(0), ParseIntPipe) minStock?: number,
    @Query('minPrice', new DefaultValuePipe(0), ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', OptionalParseFloatPipe) maxPrice?: number
  ): Promise<PaginatedResultDto<ProductDto>> {
    this.logger.info('getting products');
    
    return this.commandQueryBus.send<GetAllProductsQuery, PaginatedResultDto<ProductDto>>(
      new GetAllProductsQuery(
        pageIndex,
        pageSize,
        name,
        statuses,
        minStock,
        minPrice,
        maxPrice
      )
    );
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<ProductDto> {
    return this.commandQueryBus.send(new GetProductByIdQuery(id));
  }

  @Put('/')
  @UseGuards(AdminRoleGuard)
  update(@Body(UpdateProductSchema) request: UpdateProductDto): Promise<ProductDto> {
    this.logger.info('updating product');
    
    return this.commandQueryBus.send<UpdateProductCommand, ProductDto>(
      new UpdateProductCommand(
        request.id,
        request.name,
        request.description,
        request.price,
        request.stock,
        request.status
      )
    );
  }

  @Delete('/:id')
  @UseGuards(AdminRoleGuard)
  delete(@Param('id') id: string): Promise<void> {
    this.logger.info('deleting product');
    
    return this.commandQueryBus.send<DeleteProductCommand, void>(
      new DeleteProductCommand(
        id
      )
    );
  }
}

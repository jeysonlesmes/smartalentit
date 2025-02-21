import { AdminRoleGuard } from "@auth/infrastructure/guards/admin-role.guard";
import { RoleGuard } from "@auth/infrastructure/guards/role.guard";
import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { ProductQuantityDto } from "@invoices/application/dtos/product-quantity.dto";
import { CreateInvoiceCommand } from "@invoices/application/use-cases/create-invoice/create-invoice.command";
import { GetAllInvoicesQuery } from "@invoices/application/use-cases/get-all-invoices/get-all-invoices.query";
import { GetInvoiceByIdQuery } from "@invoices/application/use-cases/get-invoice-by-id/get-invoice-by-id.query";
import { CreateInvoiceDto, CreateInvoiceSchema } from "@invoices/infrastructure/schemas/create-invoice.schema";
import { Controller, DefaultValuePipe, ForbiddenException, Get, Param, ParseFloatPipe, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { PaginatedResultDto } from "@shared/application/dtos/paginated-result.dto";
import { UserDto } from "@shared/application/dtos/user.dto";
import { CommandQueryBus } from "@shared/application/ports/inbound/command-query-bus.port";
import { Logger } from "@shared/application/ports/outbound/logger.port";
import { AuthUser } from "@shared/infrastructure/decorators/auth-user.decorator";
import { Body } from "@shared/infrastructure/decorators/body.decorator";
import { MaxPageIndexPipe } from "@shared/infrastructure/pipes/max-page-index.pipe";
import { MinPageIndexPipe } from "@shared/infrastructure/pipes/min-page-index.pipe";
import { OptionalParseFloatPipe } from "@shared/infrastructure/pipes/optional-parse-float.pipe";

@Controller()
export class InvoiceController {
  constructor(
    private readonly commandQueryBus: CommandQueryBus,
    private readonly logger: Logger
  ) { }

  @Post('/')
  @UseGuards(new RoleGuard('user'))
  create(
    @Body(CreateInvoiceSchema) request: CreateInvoiceDto,
    @AuthUser() authUser: UserDto
  ): Promise<InvoiceDto> {
    this.logger.info('creating invoice');
    
    return this.commandQueryBus.send<CreateInvoiceCommand, InvoiceDto>(
      new CreateInvoiceCommand(
        authUser,
        request.products as ProductQuantityDto[]
      )
    );
  }

  @Get('/')
  @UseGuards(AdminRoleGuard)
  async getAll(
    @Query('pageIndex', new DefaultValuePipe(1), MinPageIndexPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', new DefaultValuePipe(10), MaxPageIndexPipe, ParseIntPipe) pageSize: number,
    @Query('user') user?: string,
    @Query('product') product?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', OptionalParseFloatPipe) maxPrice?: number
  ): Promise<PaginatedResultDto<InvoiceDto>> {
    this.logger.info('getting invoices');
    
    return await this.commandQueryBus.send<GetAllInvoicesQuery, PaginatedResultDto<InvoiceDto>>(
      new GetAllInvoicesQuery(
        pageIndex,
        pageSize,
        null,
        user ?? null,
        product ?? null,
        minPrice ?? null,
        maxPrice ?? null,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      )
    );
  }

  @Get('/user')
  @UseGuards(new RoleGuard('user'))
  async getByUser(
    @Query('pageIndex', new DefaultValuePipe(1), MinPageIndexPipe, ParseIntPipe) pageIndex: number,
    @Query('pageSize', new DefaultValuePipe(10), MaxPageIndexPipe, ParseIntPipe) pageSize: number,
    @AuthUser() authUser: UserDto,
    @Query('product') product?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', OptionalParseFloatPipe) maxPrice?: number
  ): Promise<PaginatedResultDto<InvoiceDto>> {
    this.logger.info('getting user invoices');
    
    return this.commandQueryBus.send<GetAllInvoicesQuery, PaginatedResultDto<InvoiceDto>>(
      new GetAllInvoicesQuery(
        pageIndex,
        pageSize,
        authUser.id,
        null,
        product ?? null,
        minPrice ?? null,
        maxPrice ?? null,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      )
    );
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @AuthUser() authUser: UserDto
  ): Promise<InvoiceDto> {
    const invoice = await this.commandQueryBus.send<GetInvoiceByIdQuery, InvoiceDto>(
      new GetInvoiceByIdQuery(id)
    );

    if (invoice && authUser.role.code === 'user' && invoice.user.id !== authUser.id) {
      throw new ForbiddenException('User cannot get other users invoices');
    }

    return invoice;
  }
}
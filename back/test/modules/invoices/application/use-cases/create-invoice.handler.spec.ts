import { InvoiceDto } from '@invoices/application/dtos/invoice.dto';
import { CreateInvoiceCommand } from '@invoices/application/use-cases/create-invoice/create-invoice.command';
import { CreateInvoiceHandler } from '@invoices/application/use-cases/create-invoice/create-invoice.handler';
import { ProductDuplicatedException } from '@invoices/domain/exceptions/product-duplicated.exception';
import { ProductNotActiveException } from '@invoices/domain/exceptions/product-not-active.exception';
import { ProductNotFoundException } from '@invoices/domain/exceptions/product-not-found.exception';
import { ProductWithoutStockException } from '@invoices/domain/exceptions/product-without-stock.exception';
import { InvoiceRepository } from '@invoices/domain/repositories/invoice.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductDto } from '@products/application/dtos/product.dto';
import { GetProductByIdQuery } from '@products/application/use-cases/get-product-by-id/get-product-by-id.query';
import { UpdateProductCommand } from '@products/application/use-cases/update-product/update-product.command';
import { UserDto } from '@shared/application/dtos/user.dto';
import { CommandQueryBus } from '@shared/application/ports/inbound/command-query-bus.port';
import { EventPublisher } from '@shared/application/ports/outbound/event-publisher.port';
import { Mapper } from '@shared/application/ports/outbound/mapper.port';
import { Uuid } from '@shared/domain/value-objects/uuid.vo';

describe('CreateInvoiceHandler', () => {
  let handler: CreateInvoiceHandler;
  let invoiceRepository: jest.Mocked<InvoiceRepository>;
  let commandQueryBus: jest.Mocked<CommandQueryBus>;
  let eventPublisher: jest.Mocked<EventPublisher>;
  let mapper: jest.Mocked<Mapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateInvoiceHandler,
        {
          provide: InvoiceRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: CommandQueryBus,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: EventPublisher,
          useValue: {
            publishAll: jest.fn(),
          },
        },
        {
          provide: Mapper,
          useValue: {
            map: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateInvoiceHandler>(CreateInvoiceHandler);
    invoiceRepository = module.get(InvoiceRepository);
    commandQueryBus = module.get(CommandQueryBus);
    eventPublisher = module.get(EventPublisher);
    mapper = module.get(Mapper);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create an invoice successfully', async () => {
    const productId = Uuid.generate().value();
    const userId = Uuid.generate().value();
    const statusId = Uuid.generate().value();

    const productDto: ProductDto = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      status: { id: statusId, code: 'active', name: 'Active' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto: UserDto = {
      id: userId,
      name: 'User 1',
      email: 'user@example.com',
      role: { id: Uuid.generate().value(), code: 'user' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = new CreateInvoiceCommand(userDto, [{ id: productId, quantity: 2 }]);

    commandQueryBus.send.mockResolvedValue(productDto);
    invoiceRepository.save.mockResolvedValue(undefined);
    eventPublisher.publishAll.mockResolvedValue(undefined);
    mapper.map.mockReturnValue({} as InvoiceDto);

    const result = await handler.handle(request);

    expect(commandQueryBus.send).toHaveBeenCalledWith(expect.any(GetProductByIdQuery));
    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(eventPublisher.publishAll).toHaveBeenCalled();
    expect(mapper.map).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw ProductNotFoundException if product is not found', async () => {
    const productId = Uuid.generate().value();
    const userId = Uuid.generate().value();

    const userDto: UserDto = {
      id: userId,
      name: 'User 1',
      email: 'user@example.com',
      role: { id: Uuid.generate().value(), code: 'user' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = new CreateInvoiceCommand(userDto, [{ id: productId, quantity: 2 }]);

    commandQueryBus.send.mockResolvedValue(null);

    await expect(handler.handle(request)).rejects.toThrow(ProductNotFoundException);
  });

  it('should throw ProductNotActiveException if product is not active', async () => {
    const productId = Uuid.generate().value();
    const userId = Uuid.generate().value();
    const statusId = Uuid.generate().value();

    const productDto: ProductDto = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      status: { id: statusId, code: 'inactive', name: 'Inactive' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto: UserDto = {
      id: userId,
      name: 'User 1',
      email: 'user@example.com',
      role: { id: Uuid.generate().value(), code: 'user' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = new CreateInvoiceCommand(userDto, [{ id: productId, quantity: 2 }]);

    commandQueryBus.send.mockResolvedValue(productDto);

    await expect(handler.handle(request)).rejects.toThrow(ProductNotActiveException);
  });

  it('should throw ProductWithoutStockException if product stock is insufficient', async () => {
    const productId = Uuid.generate().value();
    const userId = Uuid.generate().value();
    const statusId = Uuid.generate().value();

    const productDto: ProductDto = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 1,
      status: { id: statusId, code: 'active', name: 'Active' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto: UserDto = {
      id: userId,
      name: 'User 1',
      email: 'user@example.com',
      role: { id: Uuid.generate().value(), code: 'user' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = new CreateInvoiceCommand(userDto, [{ id: productId, quantity: 2 }]);

    commandQueryBus.send.mockResolvedValue(productDto);

    await expect(handler.handle(request)).rejects.toThrow(ProductWithoutStockException);
  });

  it('should throw ProductDuplicatedException if products are duplicated', async () => {
    const productId = Uuid.generate().value();
    const userId = Uuid.generate().value();

    const userDto: UserDto = {
      id: userId,
      name: 'User 1',
      email: 'user@example.com',
      role: { id: Uuid.generate().value(), code: 'user' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = new CreateInvoiceCommand(userDto, [
      { id: productId, quantity: 2 },
      { id: productId, quantity: 3 },
    ]);

    await expect(handler.handle(request)).rejects.toThrow(ProductDuplicatedException);
  });

  it('should handle multiple products correctly', async () => {
    const productId1 = Uuid.generate().value();
    const productId2 = Uuid.generate().value();
    const userId = Uuid.generate().value();
    const statusId = Uuid.generate().value();

    const productDto1: ProductDto = {
      id: productId1,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 10,
      status: { id: statusId, code: 'active', name: 'Active' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const productDto2: ProductDto = {
      id: productId2,
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      stock: 5,
      status: { id: statusId, code: 'active', name: 'Active' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userDto: UserDto = {
      id: userId,
      name: 'User 1',
      email: 'user@example.com',
      role: { id: Uuid.generate().value(), code: 'user' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = new CreateInvoiceCommand(userDto, [
      { id: productId1, quantity: 2 },
      { id: productId2, quantity: 1 },
    ]);

    commandQueryBus.send.mockImplementation((query) => {
      if (query instanceof GetProductByIdQuery) {
        if (query.id === productId1) return Promise.resolve(productDto1);
        if (query.id === productId2) return Promise.resolve(productDto2);
      }
      if (query instanceof UpdateProductCommand) {
        return Promise.resolve(undefined);
      }
      return Promise.resolve(null);
    });

    invoiceRepository.save.mockResolvedValue(undefined);
    eventPublisher.publishAll.mockResolvedValue(undefined);
    mapper.map.mockReturnValue({} as InvoiceDto);

    const result = await handler.handle(request);

    expect(commandQueryBus.send).toHaveBeenCalledTimes(4);
    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(eventPublisher.publishAll).toHaveBeenCalled();
    expect(mapper.map).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
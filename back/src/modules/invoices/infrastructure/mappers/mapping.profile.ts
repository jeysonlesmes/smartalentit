import { forMember, mapFrom, mapWith } from "@automapper/core";
import { InvoiceProductDto } from "@invoices/application/dtos/invoice-product.dto";
import { InvoiceUserDto } from "@invoices/application/dtos/invoice-user.dto";
import { InvoiceDto } from "@invoices/application/dtos/invoice.dto";
import { Invoice } from "@invoices/domain/entities/invoice.entity";
import { Product } from "@invoices/domain/entities/product.entity";
import { User } from "@invoices/domain/entities/user.entity";
import { AutoMapper } from "@shared/infrastructure/adapters/outbound/auto-mapper.adapter";

export const configureMappingProfile = (autoMapper: AutoMapper): void => {
  autoMapper.createMap(
    User,
    InvoiceUserDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.name,
      mapFrom(source => source.name.value())
    ),
    forMember(
      destination => destination.email,
      mapFrom(source => source.email.value())
    )
  );

  autoMapper.createMap(
    Product,
    InvoiceProductDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.name,
      mapFrom(source => source.name.value())
    ),
    forMember(
      destination => destination.quantity,
      mapFrom(source => source.quantity.value())
    ),
    forMember(
      destination => destination.unitPrice,
      mapFrom(source => source.unitPrice.value())
    ),
    forMember(
      destination => destination.totalPrice,
      mapFrom(source => source.totalPrice.value())
    )
  );

  autoMapper.createMap(
      Invoice,
      InvoiceDto,
      forMember(
        destination => destination.id,
        mapFrom(source => source.id.value())
      ),
      forMember(
        destination => destination.products,
        mapWith(InvoiceProductDto, Product, (source) => source.products)
      ),
      forMember(
        destination => destination.user,
        mapWith(InvoiceUserDto, User, (source) => source.user)
      ),
      forMember(
        destination => destination.total,
        mapFrom(source => source.total.value())
      ),
      forMember(
        destination => destination.createdAt,
        mapFrom(source => source.createdAt)
      ),
      forMember(
        destination => destination.updatedAt,
        mapFrom(source => source.updatedAt)
      ),
    );
};
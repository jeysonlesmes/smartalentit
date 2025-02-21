import { forMember, mapFrom, mapWith } from "@automapper/core";
import { ProductDto } from "@products/application/dtos/product.dto";
import { StatusDto } from "@products/application/dtos/status.dto";
import { Product } from "@products/domain/entities/product.entity";
import { Status } from "@products/domain/entities/status.entity";
import { AutoMapper } from "@shared/infrastructure/adapters/outbound/auto-mapper.adapter";

export const configureMappingProfile = (autoMapper: AutoMapper): void => {
  autoMapper.createMap(
    Status,
    StatusDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.code,
      mapFrom(source => source.code.value())
    ),
    forMember(
      destination => destination.name,
      mapFrom(source => source.name.value())
    ),
  );

  autoMapper.createMap(
    Product,
    ProductDto,
    forMember(
      destination => destination.id,
      mapFrom(source => source.id.value())
    ),
    forMember(
      destination => destination.name,
      mapFrom(source => source.name.value())
    ),
    forMember(
      destination => destination.description,
      mapFrom(source => source.description.value())
    ),
    forMember(
      destination => destination.price,
      mapFrom(source => source.price.value())
    ),
    forMember(
      destination => destination.stock,
      mapFrom(source => source.stock.value())
    ),
    forMember(
      destination => destination.status,
      mapWith(StatusDto, Status, (source) => source.status)
    ),    
    forMember(
      destination => destination.createdAt,
      mapFrom(source => source.createdAt)
    ),
    forMember(
      destination => destination.updatedAt,
      mapFrom(source => source.updatedAt)
    )
  );
};
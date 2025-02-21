import { classes } from '@automapper/classes';
import { createMap, createMapper, Dictionary, Mapper, MappingConfiguration, ModelIdentifier } from '@automapper/core';
import { Mapper as IMapper } from '@shared/application/ports/outbound/mapper.port';

export class AutoMapper extends IMapper {
  private mapper: Mapper;

  constructor() {
    super();

    this.mapper = createMapper({
      strategyInitializer: classes(),
    });
  }

  map<TDestination>(source: any, destinationClass: new () => TDestination): TDestination {
    return this.mapper.map(source, source.constructor, destinationClass);
  }

  mapArray<TDestination>(sourceArray: any[], destinationClass: new () => TDestination): TDestination[] {
    if (!sourceArray.length) {
      return [];
    }

    return this.mapper.mapArray(sourceArray, sourceArray[0].constructor, destinationClass);
  }

  createMap<TSource extends Dictionary<TSource>, TDestination extends Dictionary<TDestination>>(source: ModelIdentifier<TSource>, destination: ModelIdentifier<TDestination>, ...mappingConfigFns: (MappingConfiguration<TSource, TDestination> | undefined)[]): void {
    createMap(this.mapper, source, destination, ...mappingConfigFns);
  }
}
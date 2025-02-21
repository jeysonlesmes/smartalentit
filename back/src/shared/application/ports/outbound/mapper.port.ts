export abstract class Mapper {
  abstract map<TDestination>(source: any, destinationClass: new () => TDestination): TDestination;
  abstract mapArray<TDestination>(sourceArray: any[], destinationClass: new () => TDestination): TDestination[];
}
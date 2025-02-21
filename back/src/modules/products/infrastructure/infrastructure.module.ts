import { Module } from "@nestjs/common";
import { ProductController } from "@products/infrastructure/controllers/product.controller";
import { StatusController } from "@products/infrastructure/controllers/status.controller";
import { configureMappingProfile } from "@products/infrastructure/mappers/mapping.profile";
import { PersistenceModule } from "@products/infrastructure/persistence/persistence.module";
import { Cache } from "@shared/application/ports/outbound/cache.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Logger } from "@shared/application/ports/outbound/logger.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { AutoMapper } from "@shared/infrastructure/adapters/outbound/auto-mapper.adapter";
import { InMemoryCache } from "@shared/infrastructure/adapters/outbound/in-memory-cache.adapter";
import { InMemoryEventPublisher } from "@shared/infrastructure/adapters/outbound/in-memory-event-publisher.adapter";
import { InMemoryLogger } from "@shared/infrastructure/adapters/outbound/in-memory-logger.adapter";
import { CacheInterceptor } from "@shared/infrastructure/interceptors/cache.interceptor";

@Module({
  imports: [
    PersistenceModule
  ],
  providers: [
    {
      provide: EventPublisher,
      useClass: InMemoryEventPublisher
    },
    {
      provide: Cache,
      useClass: InMemoryCache
    },
    {
      provide: Logger,
      useClass: InMemoryLogger
    },
    {
      provide: Mapper,
      useFactory: () => {
        const autoMapper = new AutoMapper();
        configureMappingProfile(autoMapper);
        return autoMapper;
      }
    },
    CacheInterceptor
  ],
  controllers: [
    StatusController,
    ProductController
  ],
  exports: [
    EventPublisher,
    Cache,
    Logger,
    Mapper,
    CacheInterceptor,
    PersistenceModule
  ]
})
export class InfrastructureModule { }
import { AnalyticsController } from "@invoices/infrastructure/controllers/analytics.controller";
import { InvoiceController } from "@invoices/infrastructure/controllers/invoice.controller";
import { configureMappingProfile } from "@invoices/infrastructure/mappers/mapping.profile";
import { PersistenceModule } from "@invoices/infrastructure/persistence/persistence.module";
import { Module } from "@nestjs/common";
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
    InvoiceController,
    AnalyticsController
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
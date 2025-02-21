import { Module } from "@nestjs/common";
import { Cache } from "@shared/application/ports/outbound/cache.port";
import { EventPublisher } from "@shared/application/ports/outbound/event-publisher.port";
import { Logger } from "@shared/application/ports/outbound/logger.port";
import { Mapper } from "@shared/application/ports/outbound/mapper.port";
import { PasswordEncryption } from "@shared/application/ports/outbound/password-encryption.port";
import { AutoMapper } from "@shared/infrastructure/adapters/outbound/auto-mapper.adapter";
import { BcryptPasswordEncryption } from "@shared/infrastructure/adapters/outbound/bcrypt-password-encryption.adapter";
import { InMemoryCache } from "@shared/infrastructure/adapters/outbound/in-memory-cache.adapter";
import { InMemoryEventPublisher } from "@shared/infrastructure/adapters/outbound/in-memory-event-publisher.adapter";
import { InMemoryLogger } from "@shared/infrastructure/adapters/outbound/in-memory-logger.adapter";
import { CacheInterceptor } from "@shared/infrastructure/interceptors/cache.interceptor";
import { RoleController } from "@users/infrastructure/controllers/role.controller";
import { UserController } from "@users/infrastructure/controllers/user.controller";
import { configureMappingProfile } from "@users/infrastructure/mappers/mapping.profile";
import { PersistenceModule } from "@users/infrastructure/persistence/persistence.module";

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
    {
      provide: PasswordEncryption,
      useClass: BcryptPasswordEncryption
    },
    CacheInterceptor
  ],
  controllers: [
    RoleController,
    UserController
  ],
  exports: [
    EventPublisher,
    Cache,
    Logger,
    Mapper,
    CacheInterceptor,
    PersistenceModule,
    PasswordEncryption
  ]
})
export class InfrastructureModule { }
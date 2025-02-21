import { Module } from "@nestjs/common";
import { MongoDbModule } from "@users/infrastructure/persistence/mongo-db/mongo-db.module";
import { RoleRepository } from "@users/domain/repositories/role.repository";
import { UserRepository } from "@users/domain/repositories/user.repository";
import { InMemoryRoleRepository } from "@users/infrastructure/persistence/in-memory/repositories/in-memory-role.repository";
import { MongoDbUserRepository } from "@users/infrastructure/persistence/mongo-db/repositories/mongo-db-user.repository";

@Module({
  imports: [
    MongoDbModule
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: MongoDbUserRepository
    },
    {
      provide: RoleRepository,
      useClass: InMemoryRoleRepository
    }
  ],
  exports: [
    UserRepository,
    RoleRepository
  ]
})
export class PersistenceModule { }
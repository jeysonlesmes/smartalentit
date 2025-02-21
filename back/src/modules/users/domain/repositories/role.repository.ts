import { BaseRepository } from "@shared/domain/repositories/base.repository";
import { Role } from "@users/domain/entities/role.entity";

export abstract class RoleRepository extends BaseRepository<Role> {
  abstract findOneByCode(code: string): Promise<Role | null>;
}
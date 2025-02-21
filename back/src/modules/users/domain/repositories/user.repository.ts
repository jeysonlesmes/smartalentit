import { BaseRepository } from "@shared/domain/repositories/base.repository";
import { User } from "@users/domain/entities/user.entity";

export abstract class UserRepository extends BaseRepository<User> {
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract findPaginated(filters: { pageIndex: number; pageSize: number; name?: string; email?: string; roles?: string[]; }): Promise<{ total: number; items: User[]; }>;
}
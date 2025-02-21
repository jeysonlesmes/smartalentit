import { Status } from "@products/domain/entities/status.entity";
import { BaseRepository } from "@shared/domain/repositories/base.repository";

export abstract class StatusRepository extends BaseRepository<Status> {
  abstract findOneByCode(code: string): Promise<Status | null>;
}
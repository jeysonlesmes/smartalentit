import { Id } from "@shared/domain/value-objects/id.vo";

export abstract class BaseRepository<Entity> {
  abstract getAll(): Promise<Entity[]>;
  abstract findOneById(id: Id): Promise<Entity | null>;
  abstract save(entity: Entity): Promise<void>;
  abstract delete(id: Id): Promise<void>;
}
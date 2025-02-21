import { Status } from "@products/domain/entities/status.entity";
import { StatusRepository } from "@products/domain/repositories/status.repository";
import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";

export class InMemoryStatusRepository extends StatusRepository {
  private statuses: Map<string, Status>;

  constructor() {
    super();

    this.statuses = new Map([
      [
        "e37d84c1-140a-46b9-a039-bc54618670f5",
        new Status(
          new Uuid("e37d84c1-140a-46b9-a039-bc54618670f5"),
          new StringValueObject("active"),
          new StringValueObject("Active")
        )
      ],
      [
        "c4dedcca-5935-4ff9-922e-f914739ca77f",
        new Status(
          new Uuid("c4dedcca-5935-4ff9-922e-f914739ca77f"),
          new StringValueObject("inactive"),
          new StringValueObject("Inactive")
        )
      ]
    ]);
  }

  getAll(): Promise<Status[]> {
    return Promise.resolve(Array.from(this.statuses.values()));
  }

  async save(entity: Status): Promise<void> {
    this.statuses.set(entity.id.value(), entity);
  }

  async findOneById(id: Uuid): Promise<Status | null> {
    return this.statuses.get(id.value()) || null;
  }

  async delete(id: Uuid): Promise<void> {
    this.statuses.delete(id.value());
  }

  async findOneByCode(code: string): Promise<Status | null> {
    for (const status of this.statuses.values()) {
      if (status.code.value() === code) {
        return status;
      }
    }

    return null;
  }
}
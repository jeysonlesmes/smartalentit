import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { Role } from "@users/domain/entities/role.entity";
import { RoleRepository } from "@users/domain/repositories/role.repository";

export class InMemoryRoleRepository extends RoleRepository {
  private roles: Map<string, Role>;

  constructor() {
    super();

    this.roles = new Map([
      [
        "fc7e474b-2fce-4f07-852e-a3a140bd748d",
        new Role(
          new Uuid("fc7e474b-2fce-4f07-852e-a3a140bd748d"),
          new StringValueObject("admin")
        )
      ],
      [
        "3e741d4e-d074-4312-a57a-aa7cb8b3878c",
        new Role(
          new Uuid("c4dedcca-5935-4ff9-922e-f914739ca77f"),
          new StringValueObject("user")
        )
      ]
    ]);
  }

  getAll(): Promise<Role[]> {
    return Promise.resolve(Array.from(this.roles.values()));
  }

  async save(entity: Role): Promise<void> {
    this.roles.set(entity.id.value(), entity);
  }

  async findOneById(id: Uuid): Promise<Role | null> {
    return this.roles.get(id.value()) || null;
  }

  async delete(id: Uuid): Promise<void> {
    this.roles.delete(id.value());
  }

  async findOneByCode(code: string): Promise<Role | null> {
    for (const role of this.roles.values()) {
      if (role.code.value() === code) {
        return role;
      }
    }

    return null;
  }
}
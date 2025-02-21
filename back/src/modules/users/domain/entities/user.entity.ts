import { AggregateRoot } from "@shared/domain/aggregate/aggregate-root";
import { StringValueObject } from "@shared/domain/value-objects/string.vo";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { Role } from "@users/domain/entities/role.entity";
import { UserCreatedEvent } from "@users/domain/events/user-created.event";
import { UserUpdatedEvent } from "@users/domain/events/user-updated.event";
import { Email } from "@users/domain/value-objects/email.vo";

export class User extends AggregateRoot {
  constructor(
    private _id: Uuid,
    private _name: StringValueObject,
    private _email: Email,
    private _password: StringValueObject,
    private _role: Role,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {
    super();
  }

  static create(
    name: string,
    email: string,
    password: string,
    role: Role
  ): User {
    const id = Uuid.generate();

    const user = new User(
      id,
      new StringValueObject(name),
      new Email(email),
      new StringValueObject(password),
      role,
      new Date(),
      new Date()
    );

    user.record(
      new UserCreatedEvent(
        'user.created',
        {
          id,
          name,
          email,
          role: role.code
        }
      )
    );

    return user;
  }

  update(
    name: string,
    email: string,
    password: string,
    role: Role
  ): void {
    this._name = new StringValueObject(name);
    this._email = new Email(email);
    this._password = new StringValueObject(password);
    this._role = role;
    this._updatedAt = new Date();

    this.record(
      new UserUpdatedEvent(
        'user.updated',
        {
          id: this._id,
          name,
          email,
          role: role.code
        }
      )
    );
  }

  get id(): Uuid {
    return this._id;
  }

  get name(): StringValueObject {
    return this._name;
  }

  get role(): Role {
    return this._role;
  }

  get email(): Email {
    return this._email;
  }

  get password(): StringValueObject {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
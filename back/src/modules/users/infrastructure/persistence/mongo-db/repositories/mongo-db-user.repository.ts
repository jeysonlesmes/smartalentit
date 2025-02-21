import { InjectModel } from "@nestjs/mongoose";
import { Uuid } from "@shared/domain/value-objects/uuid.vo";
import { User } from "@users/domain/entities/user.entity";
import { UserRepository } from "@users/domain/repositories/user.repository";
import { UserMapper } from "@users/infrastructure/persistence/mongo-db/mappers/user.mapper";
import { User as UserDocument } from "@users/infrastructure/persistence/mongo-db/schemas/user.schema";
import { Model } from "mongoose";

export class MongoDbUserRepository extends UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly model: Model<UserDocument>
  ) {
    super();
  }

  async getAll(): Promise<User[]> {
    const users = await this.model.find().exec();

    return users.map(UserMapper.toDomain);
  }

  async save(entity: User): Promise<void> {
    await this.model.findOneAndUpdate(
      { userId: entity.id.value() },
      UserMapper.toPersistence(entity),
      { upsert: true }
    ).exec();
  }

  async findOneById(id: Uuid): Promise<User | null> {
    const user = await this.model.findOne({ userId: id.value() }).exec();

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async delete(id: Uuid): Promise<void> {
    await this.model.deleteOne({ userId: id.value() });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.model.findOne({ email }).exec();

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findPaginated({
    pageIndex,
    pageSize,
    name,
    email,
    roles
  }: {
    pageIndex: number;
    pageSize: number;
    name?: string;
    email?: string;
    roles?: string[];
  }): Promise<{ total: number; items: User[]; }> {
    const skip = (pageIndex - 1) * pageSize;

    const filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    if (roles?.length) {
      filter['role.code'] = { $in: roles };
    }

    const [users, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(pageSize).sort({ _id: -1 }).exec(),
      this.model.countDocuments(filter).exec()
    ]);

    return {
      total,
      items: users.map(UserMapper.toDomain)
    };
  }
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@users/infrastructure/persistence/mongo-db/schemas/role.schema';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: RoleSchema, required: true })
  role: Role;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
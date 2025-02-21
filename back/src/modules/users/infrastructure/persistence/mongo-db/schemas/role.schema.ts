import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Role extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  code: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
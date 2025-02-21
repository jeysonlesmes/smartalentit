import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Status extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);
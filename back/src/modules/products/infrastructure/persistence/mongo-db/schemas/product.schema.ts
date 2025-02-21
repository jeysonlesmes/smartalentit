import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status, StatusSchema } from '@products/infrastructure/persistence/mongo-db/schemas/status.schema';
import { Document, HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ unique: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Types.Decimal128 })
  price: Types.Decimal128;

  @Prop({ required: true })
  stock: number;

  @Prop({ type: StatusSchema, required: true })
  status: Status;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
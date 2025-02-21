import { Product, ProductSchema } from "@invoices/infrastructure/persistence/mongo-db/schemas/product.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User, UserSchema } from "@invoices/infrastructure/persistence/mongo-db/schemas/user.schema";
import { Document, HydratedDocument } from "mongoose";

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ unique: true })
  invoiceId: string;

  @Prop({ type: [ProductSchema], required: true })
  products: Product[];

  @Prop({ type: UserSchema, required: true })
  user: User;

  @Prop({ required: true })
  total: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
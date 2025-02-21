import { Status } from "@products/infrastructure/persistence/mysql/entities/status.entity";
import { DecimalTransformer } from "@products/infrastructure/persistence/mysql/entities/transformers/decimal.transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 16, scale: 2, transformer: new DecimalTransformer() })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({
    name: 'status_id',
    type: 'uuid'
  })
  statusId: string;

  @CreateDateColumn({ name: 'created_at', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', precision: 3 })
  updatedAt: Date;

  @ManyToOne(() => Status)
  @JoinColumn({
    name: 'status_id'
  })
  status: Status;
}
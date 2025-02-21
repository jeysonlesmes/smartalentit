import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'statuses' })
export class Status {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;
}
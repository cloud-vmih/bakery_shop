// src/entity/ItemsDiscount.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Item } from "./Item";

@Entity("items_discount")
export class ItemsDiscount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "item_id", type: "int" })
  itemId!: number;   // <- nằm riêng, không trùng

  @ManyToOne(() => Item, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "item_id" })
  item!: Item;        // <- TypeORM tự map itemId vào đây

  @Column({ type: "text", nullable: true })
  title?: string | null;

  @Column({ type: "numeric", nullable: true })
  discountAmount?: number | null;

  @Column({ type: "timestamp", nullable: true })
  startAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  endAt?: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}

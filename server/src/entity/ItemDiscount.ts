import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Item } from "./Item";

@Entity("itemsDiscount")
export class ItemsDiscount  {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Item, i => i.discounts, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "item_id" })  // Hoặc "itemId" nếu schema dùng camelCase
  item!: Item;

  @Column({ type: "text", nullable: true })
  title?: string | null;

  @Column("decimal", { precision: 5, scale: 2, nullable: true })
  discountAmount?: number | null;

  @Column({ type: "timestamp", nullable: true })
  startAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  endAt?: Date | null;

}
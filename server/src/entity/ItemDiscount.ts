import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Item } from "./Item";

@Entity("itemsDiscount")
export class ItemsDiscount {
  @PrimaryGeneratedColumn()
  id!: number;
@ManyToMany(() => Item, {
  eager: true,
  cascade: false, 
})
@JoinTable({ name: "items_discount_items" })
items!: Item[];


  @Column({ type: "text", nullable: true })
  title?: string | null;

  @Column("decimal", { precision: 5, scale: 2, nullable: true })
  discountAmount?: number | null;

  @Column({ type: "timestamp", nullable: true })
  startAt?: Date | null;

  @Column({ type: "timestamp", nullable: true })
  endAt?: Date | null;

}
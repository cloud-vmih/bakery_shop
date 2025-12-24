import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";
import { Item } from "./Item";
import { Branch } from "./Branch";

@Entity("inventory")
export class Inventory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Item, (i) => i.inventory, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "itemID" })
  item!: Item;

  @ManyToOne(() => Branch, (b) => b.inventory, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "branchID" })
  branch?: Branch;

  @Column({ type: "int", default: 0 })
  stockQuantity!: number;

  @Column({ type: "int", default: 0 })
  reservedQuantity!: number;

  @UpdateDateColumn()
  updatedAt!: Date;
}

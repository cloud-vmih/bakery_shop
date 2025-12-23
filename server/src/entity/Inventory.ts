import {
<<<<<<< HEAD
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
=======
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
>>>>>>> feature/updateQuantity-v2
} from "typeorm";
import { Item } from "./Item";
import { Branch } from "./Branch";

@Entity("inventory")
export class Inventory extends BaseEntity {
<<<<<<< HEAD
  @PrimaryGeneratedColumn()
  id!: number;

  /* ===== RELATIONS ===== */

  @ManyToOne(() => Item, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "itemID" })
  item!: Item;

  @ManyToOne(() => Branch, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "branchID" })
  branch?: Branch;

  /* ===== STOCK ===== */

  // Tổng số lượng tồn kho thực tế
  @Column({ type: "int", default: 0 })
  stockQuantity!: number;

  // Số lượng đang được giữ cho checkout
  @Column({ type: "int", default: 0 })
  reservedQuantity!: number;

  /* ===== META ===== */

  @UpdateDateColumn()
  updatedAt!: Date;
}
=======
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Item, i => i.inventory, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "itemID" })
    item!: Item;

    @ManyToOne(() => Branch, b => b.inventory, {
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
>>>>>>> feature/updateQuantity-v2

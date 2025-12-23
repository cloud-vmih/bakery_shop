<<<<<<< HEAD
import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  BaseEntity,
  PrimaryColumn,
} from "typeorm";
=======
import { Entity, ManyToOne, JoinColumn, Column, BaseEntity, PrimaryColumn } from "typeorm";
>>>>>>> feature/updateQuantity-v2
import { Order } from "./Orders";
import { Item } from "./Item";

@Entity("orderDetail")
export class OrderDetail extends BaseEntity {
  @PrimaryColumn({ name: "orderID", type: "int" })
  orderID!: number;

  @PrimaryColumn({ name: "itemID", type: "int" })
  itemID!: number;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  @JoinColumn({ name: "orderID" })
  order!: Order;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "itemID" })
  item!: Item;

<<<<<<< HEAD
  @Column({ type: "int" })
  quantity!: number;
}
=======
  @Column({ nullable: true })
  note?: string;

  @Column()
  quantity?: number
}
>>>>>>> feature/updateQuantity-v2

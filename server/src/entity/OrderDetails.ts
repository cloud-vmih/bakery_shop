import { Entity, ManyToOne, JoinColumn, Column, BaseEntity, PrimaryColumn } from "typeorm";
import { Order } from "./Orders";

@Entity("orderDetail")
export class OrderDetail extends BaseEntity {
  @PrimaryColumn({ name: "orderID", type: "bigint" })
  orderID!: number;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  @JoinColumn({ name: "orderID" })
  order?: Order;

  @Column({ type: "json", nullable: true })
  itemInfo?: any;

  @Column({ nullable: true })
  note?: string;

  @Column()
  quantity?: number
}
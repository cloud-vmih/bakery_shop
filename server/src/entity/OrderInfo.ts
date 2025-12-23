import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Order } from "./Orders";
import { Address } from "./Address";

@Entity("orderInfo")
export class OrderInfo extends BaseEntity {
  @PrimaryColumn({ name: "orderID", type: "int" })
  orderID!: number;

  @OneToOne(() => Order)
  @JoinColumn({ name: "orderID" })
  order!: Order;

  @Column({ length: 100 })
  cusName!: string;

  @Column({ length: 15 })
  cusPhone!: string;

  @Column({ length: 100 })
  cusGmail!: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "addressID" })
  address!: Address;

  // @Column({ type: "date" })
  // deliveryDate!: string;

  // @Column({ length: 50 })
  // timeFrame!: string;

  @Column({ type: "text", nullable: true })
  note?: string;
}

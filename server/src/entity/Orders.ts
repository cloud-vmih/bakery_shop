import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne
} from "typeorm";
import { Customer } from "./Customer";
import {
  EOrderStatus,
  ECancelStatus,
} from "./enum/enum";
import { OrderDetail } from "./OrderDetails";
import { OrderInfo } from "./OrderInfo";
import { Payment } from "./Payment";
import { C } from "@upstash/redis/zmscore-DhpQcqpW";

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @CreateDateColumn({ type: "timestamp" })
  createAt?: Date;

  @Column({
    type: "enum",
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  status?: EOrderStatus;

  // === THÊM CÁC TRƯỜNG MỚI (from QD feature)===
  @Column({
    type: "enum",
    enum: ECancelStatus,
    default: ECancelStatus.NONE,
  })
  cancelStatus?: ECancelStatus;

  @Column({ type: "text", nullable: true })
  cancelReason?: string;

  @Column({ type: "text", nullable: true })
  cancelNote?: string;

  @Column({ nullable: true })
  cancelHandledBy?: string;

  @OneToMany(() => OrderDetail, (od: OrderDetail) => od.order, { cascade: true })
  orderDetails?: OrderDetail[];


  @OneToOne(() => OrderInfo, (info) => info.order)
  orderInfo?: OrderInfo;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;
}
// src/entity/Orders.ts

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
} from "typeorm";
import { User } from "./User";
import {
  EOrderStatus,
  EPayment,
  EPayStatus,
  ECancelStatus,
} from "./enum/enum";
import { OrderDetail } from "./OrderDetails";

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "customerID" })
  customer?: User;

  @CreateDateColumn({ type: "timestamp" })
  createAt?: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt?: Date;

  @Column({
    type: "enum",
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  status?: EOrderStatus;

  // === THÊM CÁC TRƯỜNG MỚI ===
  @Column({
    type: "enum",
    enum: EPayment,
    default: EPayment.COD,
  })
  paymentMethod?: EPayment;

  @Column({
    type: "enum",
    enum: EPayStatus,
    default: EPayStatus.PENDING,
  })
  payStatus?: EPayStatus;

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

  @OneToMany(() => OrderDetail, (od) => od.order, { cascade: true })
  orderDetails?: OrderDetail[];
}
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
import { User } from "./User";
import {
  EOrderStatus,
  ECancelStatus,
} from "./enum/enum";
import { OrderDetail } from "./OrderDetails";
import { OrderInfo } from "./OrderInfo";
import { Payment } from "./Payment";

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "customerID" })
  customer?: User;

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

  @OneToMany(() => OrderDetail, (od) => od.order, { cascade: true })
  orderDetails?: OrderDetail[];


  @OneToOne(() => OrderInfo, (info) => info.order)
  orderInfo?: OrderInfo;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;
}
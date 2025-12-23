import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "./User";
import { EOrderStatus } from "./enum/enum";
import { OrderDetail } from "./OrderDetails";
import { OrderInfo } from "./OrderInfo";

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "customerID" })
  customer?: User;

  @Column({ type: "timestamp", nullable: true, default: () => "NOW()" })
  createAt?: Date;

  @Column({
    type: "enum",
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  status?: EOrderStatus;

  @OneToMany(() => OrderDetail, (od) => od.order)
  orderDetails?: OrderDetail[];

  /** ✅ THÊM QUAN HỆ NÀY */
  @OneToOne(() => OrderInfo, (info) => info.order)
  orderInfo?: OrderInfo;
}

import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column, BaseEntity, OneToMany, OneToOne } from "typeorm";
import { User } from "./User";          
import { EOrderStatus, EPayStatus, ECancelStatus } from "./enum/enum";
import { OrderDetail } from "./OrderDetails";
import { Payment } from "./Payment";

@Entity("orders")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "customerID" })
  customer?: User;

  @Column({ type: "timestamp", nullable: true, default: () => "NOW()" })
  createAt?: Date;

  @Column({ type: "timestamp", nullable: true})
  deliveryAt?: Date

  @Column({
    type: "enum",
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  status?: EOrderStatus;

  @Column({
    type: "enum",
    enum: ECancelStatus,
    default: ECancelStatus.NONE,
  })
  cancelStatus?: ECancelStatus;

  @OneToMany(() => OrderDetail, od => od.order)
  orderDetails?: OrderDetail[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment?: Payment;
}

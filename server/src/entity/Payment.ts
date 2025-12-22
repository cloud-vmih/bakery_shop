import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, BaseEntity, OneToOne } from "typeorm";
import { Order } from "./Orders";  
import { EPayment, EPayStatus } from "./enum/enum";

@Entity("payment")
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: "orderID" })
  order?: Order;

  @Column({ type: "timestamp", nullable: true, default: () => "NOW()" })
  createAt?: Date;

  @Column({
    type: "enum",
    enum: EPayStatus,
    default: EPayStatus.PENDING,
  })
  status?: EPayStatus;

  @Column({
    type: "enum",
    enum: EPayment,
    default: EPayment.COD,
  })
  paymentMethod?: EPayment;
}

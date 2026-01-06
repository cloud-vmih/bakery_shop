import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class MembershipPoint {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer, (user) => user.points)
  @JoinColumn({ name: "customerID" })
  user!: Customer;

  @Column("decimal", { precision: 15, scale: 2 })
  orderAmount!: number; // tổng tiền đơn hàng

  @Column("int")
  earnedPoints!: number; // số điểm nhận được

  @Column({ nullable: true })
  orderId?: number; // tham chiếu đơn hàng

  @Column({ type: "text", nullable: true })
  note?: string; // thêm note để lưu thông báo (dưới 100k hoặc tích điểm)

  @CreateDateColumn()
  createdAt!: Date;
}

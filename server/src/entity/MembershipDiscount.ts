import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MembershipDiscount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;  // Mã giảm giá (unique)

  @Column()
  title!: string;  // Tiêu đề (e.g. "Giảm 10% cho thành viên VIP")

  @Column("decimal", { precision: 5, scale: 2 })  // % giảm (e.g. 10.00)
  discountAmount!: number;

  @Column("int")
  minPoints!: number;  // Điểm tối thiểu để áp dụng (e.g. 100)

  @Column({ type: "timestamp", nullable: true })
  startAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  endAt?: Date;

  @Column({ default: true })
  isActive!: boolean;  // Trạng thái hoạt động

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Item } from "./Item";  // Adjust path nếu cần

@Entity("membership_discount")
export class MembershipDiscount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("decimal", { precision: 5, scale: 2 })
  discountAmount!: number;

  @Column("int")
  minPoints!: number;

  @ManyToOne(() => Item, { nullable: true })
  @JoinColumn({ name: "itemId" })
  item?: Item;  // Optional relation

  @Column({ type: "int", nullable: true })
  itemId?: number;

  @Column({ type: "timestamp", nullable: true })
  startAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  endAt?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

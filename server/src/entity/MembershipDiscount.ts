import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Item } from "./Item"; 

@Entity("membership_discounts")  
export class MembershipDiscount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("decimal", { precision: 5, scale: 2 })
  discountAmount!: number;

  @Column("int")
  minPoints!: number;

  @ManyToMany(() => Item, (i)=> i.membershipDiscounts, { nullable: true })
  @JoinTable({ name: "membership_discount_items" })
  items?: Item[]; 

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
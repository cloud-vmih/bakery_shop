import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BaseEntity,
  Index,
} from "typeorm";
import { Customer } from "./Customer";
import { Branch } from "./Branch";

@Entity("address")
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /* ========================
     GOOGLE MAP DATA
  ======================== */

  // place_id từ Google Places
  @Column({ nullable: true })
  placeId?: string;

  // formatted_address từ Google
  @Column({ nullable: true })
  formattedAddress?: string;

  @Column("decimal", { precision: 10, scale: 7 })
  @Index()
  latitude!: number;

  @Column("decimal", { precision: 10, scale: 7 })
  @Index()
  longitude!: number;

  /* ========================
     RELATION
  ======================== */

  // Customer có nhiều address
  @ManyToOne(() => Customer, (c) => c.addresses, { nullable: true })
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  // Branch có 1 address cố định
  @OneToOne(() => Branch, (b) => b.address, { nullable: true })
  @JoinColumn({ name: "branchID" })
  branch?: Branch;

  /* ========================
     BUSINESS LOGIC
  ======================== */

  @Column({ default: false })
  isDefault!: boolean;
}

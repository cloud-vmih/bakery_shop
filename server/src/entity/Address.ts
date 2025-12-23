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
@Index(["customer", "placeId"], { unique: true })
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /* ========================
     GOOGLE GOOGLE MAP DATA
  ======================== */

  // place_id từ Google Places
  @Column({ nullable: true })
  placeId?: string;

  // formatted_address từ Google (🔥 BẮT BUỘC)
  @Column({ type: "text" })
  fullAddress!: string;

  @Column("decimal", { precision: 10, scale: 7 })
  @Index()
  lat!: number;

  @Column("decimal", { precision: 10, scale: 7 })
  @Index()
  lng!: number;

  /* ========================
     RELATION
  ======================== */

  // Customer có nhiều address
  @ManyToOne(() => Customer, (c) => c.addresses, {
    nullable: true,
    onDelete: "CASCADE", // 🔥 xoá customer → xoá address
  })
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  // Branch có 1 address cố định
  @OneToOne(() => Branch, (b) => b.address, {
    nullable: true,
    onDelete: "SET NULL", // 🔥 xoá branch → giữ address
  })
  @JoinColumn({ name: "branchID" })
  branch?: Branch;

  /* ========================
     BUSINESS LOGIC
  ======================== */

  @Column({ default: false })
  isDefault!: boolean;
}

import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";

@Entity("staff")
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  // ← Xóa fullName và email (không cần ở đây, lấy từ user qua join)

  @Column({ default: "staff" })
  role!: string;

  @Column({
    type: "enum",
    enum: ["active", "locked"],
    default: "active",
  })
  status!: "active" | "locked";

  @OneToOne(() => Account, { eager: true, cascade: true })
  @JoinColumn({ name: "accountID" })
  account!: Account;
}
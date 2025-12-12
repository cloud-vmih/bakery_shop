import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Account } from "./Account";

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  role!: string;

  @Column()
  status!: string;

  @OneToOne(() => Account, { eager: true })
  @JoinColumn({ name: "accountID" })
  account?: Account;  // 🔹 thêm dòng này

  @Column()
fullName!: string;

@Column()
email!: string;

@Column({ nullable: true })
phoneNumber?: string;

@Column({ type: "timestamp", nullable: true })
dateOfBirth?: Date;

@Column({ type: "varchar", default: "staff" })
type?: string;

}

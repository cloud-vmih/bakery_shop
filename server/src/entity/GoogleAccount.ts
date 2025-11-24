import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Account } from "./Account";

@Entity("google_account")
export class GoogleAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  provider_user_id?: string;

  @Column({ nullable: true })
  email?: string;

  @ManyToOne(() => Account, a => a.googleAccounts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "account_id" })
  account?: Account;

  @Column({ type: "timestamp", nullable: true, default: () => "NOW()" })
  createdAt?: Date;
}

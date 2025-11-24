import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, BaseEntity } from "typeorm";
import { Account } from "./Account";

@Entity("email_verification")
export class EmailVerification extends BaseEntity {
  @PrimaryColumn({ name: "accountId" })
  accountId?: number;

  @OneToOne(() => Account, a => a.emailVerification, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "accountId" })
  account?: Account;

  @Column({ default: false })
  isVerified?: boolean;

  @Column({ type: "timestamp", nullable: true })
  verifiedAt?: Date;
}

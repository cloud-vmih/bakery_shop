import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany } from "typeorm"
import { User } from "./User";
import { GoogleAccount } from "./GoogleAccount";
import { EmailVerification } from "./EmailVerification";

@Entity("account")
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50 })
  username?: string;

  @Column({ type: "char", length: 60 })
  password?: string;

  @OneToOne(() => EmailVerification, ev => ev.account)
  emailVerification?: EmailVerification;

  @OneToMany(() => GoogleAccount, ga => ga.account)
  googleAccounts?: GoogleAccount[];

  @OneToOne(() => User, u => u.account)
  user?: User;
}

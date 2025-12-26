import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  TableInheritance,
  OneToOne,
  ManyToMany,
} from "typeorm";
import { ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from "typeorm";
import { Account } from "./Account";
import { Conversation } from "./Conversation";
import { Message } from "./Message";
import { Notification } from "./Notification";

@Entity("users")
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  fullName?: string;

  @Column()
  email?: string;

  @Column({ length: 10 })
  phoneNumber?: string;

  @Column({ type: "timestamp" })
  dateOfBirth?: Date;

  @OneToOne(() => Account, (a) => a.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "accountID" })
  account?: Account;

  @Column({ nullable: true })
  avatarURL?: string;

  @CreateDateColumn({ name: "joinAt" })
  joinAt?: Date;

  @OneToMany(() => Message, (msg) => msg.senderUser)
  messages?: Message[];

  @ManyToMany(() => Notification, (noti) => noti.users)
  notifications?: Notification[];

  @Column({ type: "varchar", default: "user" })
  type?: string;
}

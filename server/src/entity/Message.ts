import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity({ name: "messages" })
export class Message {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @ManyToOne(() => User, user => user.messages, {
    onDelete: "SET NULL",
  })
  sender?: User;

  @ManyToOne(() => Conversation, conv => conv.messages, {
    onDelete: "CASCADE",
  })
  conversation?: Conversation;

  @Column({ type: "text" })
  contents?: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  sentAt?: Date;

  @Column({ type: "boolean", default: false })
  isRead?: boolean;
}

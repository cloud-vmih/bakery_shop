import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";
import { ESender } from "./enum/enum";

@Entity({ name: "messages" })
export class Message {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @Column()
  senderId!: string;

  @ManyToOne(() => User)
  senderUser?: User;
  
  @ManyToOne(() => Conversation, conv => conv.messages, {
    onDelete: "CASCADE",
  })
  conversation?: Conversation;

  @Column({ type: "text" })
  content?: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  sentAt?: Date;

  @Column({ type: "boolean", default: false })
  isRead?: boolean;
}

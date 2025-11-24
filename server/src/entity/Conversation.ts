import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity({ name: "conversation" })
export class Conversation {
    @PrimaryGeneratedColumn("increment")
    id?: number;

    @OneToMany(() => Message, msg => msg.conversation)
    messages?: Message[];

}

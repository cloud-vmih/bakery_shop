import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from "typeorm";
import { ENotiType } from "./enum/enum";
import { User } from "./User";

@Entity({ name: "notification" })
export class Notification {
    @PrimaryGeneratedColumn("increment")
    id?: number;

    @Column({ type: "text" })
    title?: string;

    @Column({ type: "text" })
    contents?: string;
        
    @Column({ type: "timestamp" })
    sentAt?: Date;

    @Column({ type: "boolean", default: false })
    isRead?: boolean;

    @Column({
        type: "enum",
        enum: ENotiType,
    })
    notiType?: ENotiType;

    @ManyToMany(() => User, user => user.notifications)
    @JoinTable({
    name: "notification_user",
    joinColumn: { name: "notificationID" },
    inverseJoinColumn: { name: "userID" }
    })
    users?: User[];

}

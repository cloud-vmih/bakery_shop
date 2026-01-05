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
        
    @Column({ type: "timestamp", default: () => "NOW()" })
    sentAt?: Date;

    @Column({ type: "boolean", default: false })
    isRead?: boolean;

    @Column({ type: "text", nullable: true })
    href?: string;

    @Column({
        type: "enum",
        enum: ENotiType,
    })
    notiType?: ENotiType;

    @ManyToMany(() => User, (user: User) => user.notifications)
    @JoinTable({
    name: "notification_user",
    joinColumn: { name: "notificationID" },
    inverseJoinColumn: { name: "userID" }
    })
    users?: User[];

}

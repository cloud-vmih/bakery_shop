import { ChildEntity } from "typeorm"
import { User } from "./User";
import { OneToMany, JoinColumn, Column } from "typeorm"
import { ResponseRating } from "./ResponseRating"


@ChildEntity()
export class Staff extends User {
   @OneToMany(() => ResponseRating, rr => rr.staff)
   response?: ResponseRating;

    @Column({
        type: "enum",
        enum: ["active", "locked"],
        default: "active",
    })
    status!: "active" | "locked";

}

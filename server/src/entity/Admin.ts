import { ChildEntity } from "typeorm"
import { User } from "./User";
import { OneToMany, JoinColumn } from "typeorm"
import { ResponseRating } from "./ResponseRating"


@ChildEntity()
export class Admin extends User {
   @OneToMany(() => ResponseRating, (responseRating) => responseRating.admin)
   responses?: ResponseRating[];
}

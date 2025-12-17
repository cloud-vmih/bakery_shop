import { ChildEntity } from "typeorm"
import { User } from "./User";
import { OneToMany, JoinColumn } from "typeorm"
import { ResponseRating } from "./ResponseRating"
import { response } from "express";

@ChildEntity()
export class Staff extends User {
   @OneToMany(() => ResponseRating, rr => rr.staff)
   response?: ResponseRating;
}

import { ChildEntity } from "typeorm"
import { User } from "./User";

@ChildEntity()
export class Staff extends User {

}

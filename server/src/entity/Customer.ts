import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  TableInheritance,
  ChildEntity,
  OneToOne,
} from "typeorm";
import { ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from "typeorm";
import { Address } from "./Address";
import { User } from "./User";
import { Wishlist } from "./Wishlist";
import { Rating } from "./Rating";

@ChildEntity()
export class Customer extends User {
  @Column({ nullable: true })
  membership?: number;

  @OneToMany(() => Address, (ad: Address) => ad.customer)
  addresses?: Address[];

  @OneToMany(() => Wishlist, (w) => w.customer)
  wishlists!: Wishlist[];

  @OneToMany(() => Rating, (r: Rating) => r.customer)
  ratings?: Rating[];
}

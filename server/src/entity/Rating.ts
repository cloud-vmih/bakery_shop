import { Entity, ManyToOne, JoinColumn, Column, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm"
import { Item } from "./Item"
import { Customer } from "./Customer"
import { ResponseRating } from "./ResponseRating";

@Entity("rating")
export class Rating extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Item, (i: Item) => i.ratings)
  @JoinColumn({ name: "itemID" })
  item?: Item;

  @ManyToOne(() => Customer, (c: Customer) => c.ratings)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @OneToMany(() => ResponseRating, (responseRating: ResponseRating) => responseRating.rating)
  responses?: ResponseRating[];

  @Column()
  contents!: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  createAt!: Date;
}

import { Entity, ManyToOne, JoinColumn, Column, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn } from "typeorm"
import { Item } from "./Item"
import { Customer } from "./Customer"

@Entity("rating")
export class Rating extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Item, (i) => i.ratings)
  @JoinColumn({ name: "itemID" })
  item?: Item;

  @ManyToOne(() => Customer, (c) => c.ratings)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @Column()
  contents!: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  createAt!: Date;
}

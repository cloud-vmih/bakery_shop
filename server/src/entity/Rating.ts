import { Entity, ManyToOne, JoinColumn, Column, CreateDateColumn, BaseEntity, Unique, PrimaryColumn } from "typeorm"
import { Item } from "./Item"
import { Customer } from "./Customer"

@Entity("rating")
@Unique(["itemID", "customerID"])
export class Rating extends BaseEntity {

  @PrimaryColumn({ name: "itemID", type: "bigint" })
  itemID!: number;

  @PrimaryColumn({ name: "customerID", type: "bigint" })
  customerID!: number;

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

import { Entity, ManyToOne, JoinColumn, Unique, BaseEntity, PrimaryColumn, OneToOne, ManyToMany } from "typeorm"
import { Item } from "./Item"
import { Customer } from "./Customer";

@Entity("wishlist")
@Unique(["customerID", "itemID"])
export class Wishlist extends BaseEntity {
  @PrimaryColumn({ name: "customerID", type: "bigint" })
  customerID!: number;

  @PrimaryColumn({ name: "itemID", type: "bigint" })
  itemID?: number;

  @ManyToOne(() => Customer, c => c.wishlist)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @ManyToMany(() => Item, i => i.wishlist)
  @JoinColumn({ name: "itemID" })
  item?: Item[];
}


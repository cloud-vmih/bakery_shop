import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { ECategory } from "./enum/enum";
import { Wishlist } from "./Wishlist";
import { Rating } from "./Rating";
import { ItemsDiscount } from "./ItemDiscount";
import { MembershipDiscount } from "./MembershipDiscount";
import {Inventory} from "./Inventory";

@Entity("item")
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  description?: string;

  @Column()
  price?: number;

  @Column({ nullable: true })
  imageURL?: string;

  @Column({
    type: "enum",
    enum: ECategory,
    nullable: true,
  })
  category?: ECategory;

  @Column({ type: "json", nullable: true })
  itemDetail?: any;

  @OneToMany(() => Wishlist, w => w.item)
  wishlists!: Wishlist[];

  @OneToMany(() => Rating, (r) => r.item)
  ratings?: Rating[];

  @OneToMany(() => Inventory, (i: Inventory) => i.item)
  inventory?: Inventory[];

  @ManyToMany(() => ItemsDiscount, (i: ItemsDiscount)=> i.items)
  discounts?: ItemsDiscount[];

  @ManyToMany(() => MembershipDiscount, (m)=> m.items)
  membershipDiscounts?: MembershipDiscount[];
}

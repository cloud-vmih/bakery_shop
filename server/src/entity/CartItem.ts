import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { Cart } from "./Cart";
import { Item } from "./Item";

@Entity("cartItem")
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Cart, (c) => c.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cartID" })
  cart?: Cart;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "itemID" })
  item?: Item;

  @Column({ default: 1 })
  quantity?: number;
}

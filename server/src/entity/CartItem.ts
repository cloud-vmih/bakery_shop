import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, BaseEntity, OneToOne } from "typeorm"
import { Cart } from "./Cart"
import { Item } from "./Item"

@Entity("cartItem")
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Cart, c => c.items)
  @JoinColumn({ name: "cartID" })
  cart?: Cart;

  @OneToOne(() => Item)
  @JoinColumn({ name: "itemID" })
  item?: Item;

  @Column({ default: 1 })
  quantity?: number;
}

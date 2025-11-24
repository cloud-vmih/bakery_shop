import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany, BaseEntity } from "typeorm"
import { User } from "./User"
import { CartItem } from "./CartItem"

@Entity("cart")
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "customerID" })
  customer?: User;  
    
  @Column({ type: "timestamp", nullable: true })
  createAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  updateAt?: Date;

  @OneToMany(() => CartItem, (ci: CartItem) => ci.cart)
  items?: CartItem[];
}

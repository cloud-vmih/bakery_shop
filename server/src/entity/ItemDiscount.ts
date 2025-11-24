import { Entity, Column, BaseEntity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Item } from "./Item";  

@Entity("itemsDiscount")
export class ItemsDiscount extends BaseEntity {
  @OneToOne(() => Item)
  @JoinColumn({ name: "itemID" })
  @PrimaryColumn()
  itemId?: number;

  @Column()
  title?: string;

  @Column()
  dicountAmount?: number;

  @Column({ type: "timestamp", nullable: true})
  startAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  endAt?: Date;
}

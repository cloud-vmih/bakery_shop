import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, OneToOne, Index } from "typeorm";
import { Customer } from "./Customer";
import { Branch } from "./Branch";

@Entity("address")
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: Number;

  @Column()
  placeId!: string;

  @ManyToOne(() => Customer, c => c.addresses)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @OneToOne(() => Branch, b => b.address, { cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
  @JoinColumn({name: "branchID"})
  branch?: Branch

  @Column()
  fullAddress?: string;

  @Column("decimal", { precision: 10, scale: 7 })
  lat?: number;

  @Column("decimal", { precision: 10, scale: 7 })
  lng?: number;
<<<<<<< HEAD
  
}
=======

}
>>>>>>> origin/feature/for_merge

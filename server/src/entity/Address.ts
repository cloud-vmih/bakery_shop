import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, OneToOne } from "typeorm";
import { Customer } from "./Customer";
import { Branch } from "./Branch";

@Entity("address")
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  placeId!: string;

  @ManyToOne(() => Customer, c => c.addresses)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @OneToOne(() => Branch, b => b.address )
  @JoinColumn({name: "branchID"})
  branch?: Branch

  @Column()
  fullAddress?: string;

  @Column("decimal", { precision: 10, scale: 7 })
  lat?: number;

  @Column("decimal", { precision: 10, scale: 7 })
  lng?: number;

  @Column({ default: true })
  isDefault?: boolean;
}

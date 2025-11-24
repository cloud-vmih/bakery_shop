import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Customer } from "./Customer";

@Entity("address")
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Customer, c => c.addresses)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @Column({ type: "char", length: 15 })
  addressNumber?: string;

  @Column()
  street?: string;  
  @Column()
  ward?: string;

  @Column({ default: true })
  isDefault?: boolean;
}

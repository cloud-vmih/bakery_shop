import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, OneToOne } from "typeorm";
import { Customer } from "./Customer";
import { Branch } from "./Branch";

@Entity("address")
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  ggMapId!: number;

  @ManyToOne(() => Customer, c => c.addresses)
  @JoinColumn({ name: "customerID" })
  customer?: Customer;

  @OneToOne(() => Branch, b => b.address )
  @JoinColumn({name: "branchID"})
  branch?: Branch

  @Column({ type: "char", length: 15 })
  addressNumber?: string;

  @Column()
  street?: string;  
  @Column()
  ward?: string;

  @Column({ default: true })
  isDefault?: boolean;
}

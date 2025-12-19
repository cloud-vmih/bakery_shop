import { Entity, PrimaryGeneratedColumn, OneToOne, Column, BaseEntity } from "typeorm"
import { Address } from "./Address";

@Entity("branch")
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string; 
    
  @OneToOne(() => Address, (a: Address) => a.branch)
  address?: Address;
}

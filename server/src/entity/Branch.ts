import {Entity, PrimaryGeneratedColumn, OneToOne, Column, BaseEntity, OneToMany} from "typeorm"
import { Address } from "./Address";
import {BranchItem} from "./BranchItems";

@Entity("branch")
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string; 
    
  @OneToOne(() => Address, (a: Address) => a.branch)
  address?: Address;

  @OneToMany(() => BranchItem, (BI: BranchItem)=> BI.branch)
    branchItems?: BranchItem[]
}

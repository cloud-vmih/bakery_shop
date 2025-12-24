import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Address } from "./Address";
import { Inventory } from "./Inventory";

@Entity("branch")
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @OneToOne(() => Address, (a: Address) => a.branch)
  address?: Address;

  @OneToMany(() => Inventory, (i: Inventory) => i.branch)
  inventory?: Inventory[];
}

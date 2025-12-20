import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn
} from "typeorm"
import {Branch} from "./Branch";
import {Item} from "./Item";

@Entity("branchItem")
@Unique(["branch", "item"])
export class BranchItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Branch, b => b.branchItems, { onDelete: "CASCADE" })
    @JoinColumn({ name: "branchID" })
    branch!: Branch;

    @ManyToOne(() => Item, i => i.branchItems, { onDelete: "CASCADE" })
    @JoinColumn({ name: "itemID" })
    item!: Item;

    @Column({ default: 0 })
    quantity?: number;

    @CreateDateColumn({ name: "createdAt" })
    createdAt?: Date;
}

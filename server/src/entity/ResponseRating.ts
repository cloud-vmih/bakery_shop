import { Entity, OneToOne, JoinColumn, Column, ManyToOne, BaseEntity, PrimaryGeneratedColumn } from "typeorm"
import { Rating } from "./Rating"
import { Staff } from "./Staff"
import { Admin } from "./Admin"

@Entity("responseRating")
export class ResponseRating extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Rating, r => r.responses, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "ratingId" })
  rating?: Rating;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "staffID" })
  staff?: Staff;

  @ManyToOne(() => Admin, (a) => a.responses)
  @JoinColumn({ name: "adminID" })
  admin?: Admin;

  @Column()
  contents!: string;

  @Column({ type: "timestamp", default: () => "NOW()" })
  createAt!: Date;

}
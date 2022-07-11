import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "../../user/entity/user.entity";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "추천한 게시글/댓글 id",
  })
  target_id: number;

  @Column({
    type: "tinyint",
    comment: "1: 게시글 2; 댓글",
  })
  target_type: number;

  @CreateDateColumn({ comment: "좋아요를 누른 시간" })
  datetime: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;
}

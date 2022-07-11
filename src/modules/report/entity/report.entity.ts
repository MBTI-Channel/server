import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "../../user/entity/user.entity";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "신고받은 게시글/댓글 아이디",
  })
  target_id: number;

  @Column({ type: "tinyint", comment: "1: 게시글, 2: 댓글" })
  target_type: number;

  @Column({ comment: "신고받은 유저 아이디" })
  target_user_id: number;

  @CreateDateColumn({ comment: "신고날짜 시간" })
  datetime: Date;

  @Column({ nullable: true, comment: "신고사유 (max: 300)" })
  reason?: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./user.entity";

@Entity("Notification")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "int", comment: "알림을 준 유저 id" })
  targetUserId: number;

  @Column({ nullable: false, type: "int", comment: "게시글, 댓글 id" })
  targetId: number;

  @Column({
    nullable: false,
    type: "varchar",
    length: "20",
    comment: "알림 종류[comment, reply, notice]",
  })
  type: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: "255",
    comment: "알림 클릭시 이동할 주소",
  })
  url: string;

  @CreateDateColumn({ type: "datetime", comment: "알림이 온 시간" })
  datetime: Date;

  @Column({ nullable: true, type: "datetime", comment: "알림 읽은 시간" })
  read_datetime?: Date | null;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;
}

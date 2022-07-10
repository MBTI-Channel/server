import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { NotificationType } from "../../../shared/type.shared";

import { User } from "../../user/entity/user.entity";

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
    type: "tinyint",
    comment: "알림 종류[1:comment 2:reply 3:likes 4:trend 5:notice]",
  })
  type: number;

  @Column({ length: 50, comment: "알림 제목" })
  title: string;

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

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  // db로 넣을때
  static typeTo(type: NotificationType) {
    switch (type) {
      case "comment":
        return 1;
      case "reply":
        return 2;
      case "likes":
        return 3;
      case "trend":
        return 4;
      case "notice":
        return 5;
    }
  }

  // db에서 코드로 바꿀때
  static typeFrom(type: number) {
    switch (type) {
      case 1:
        return "comment";
      case 2:
        return "reply";
      case 3:
        return "likes";
      case 4:
        return "trend";
      case 5:
        return "notice";
    }
  }
}

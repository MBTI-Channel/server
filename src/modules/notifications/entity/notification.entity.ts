import { Entity, Column, ManyToOne } from "typeorm";
import { NotificationTypeTransformer } from "../helper/notification-type-transformer";
import { BaseEntity } from "../../../shared/base.entity";
import { NotificationType } from "../../../shared/type.shared";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Notification extends BaseEntity {
  @Column({
    nullable: false,
    type: "int",
    comment: "알림을 준 유저 id",
    unsigned: true,
  })
  targetUserId: number;

  @Column({
    nullable: false,
    type: "int",
    comment: "게시글, 댓글 id",
    unsigned: true,
  })
  targetId: number;

  @Column({
    nullable: false,
    type: "tinyint",
    transformer: new NotificationTypeTransformer(),
    comment: "알림 종류[1:comment 2:reply 3:likes 4:trend 5:notice]",
  })
  type: number | NotificationType;

  @Column({ length: 50, comment: "알림 제목" })
  title: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: "255",
    comment: "알림 클릭시 이동할 주소",
  })
  url: string;

  @Column({ nullable: true, type: "datetime", comment: "알림 읽은 시간" })
  readAt: Date;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ unsigned: true })
  userId: number;

  static of(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ) {
    const notification = new Notification();
    notification.targetUserId = targetUser.id;
    notification.userId = type === "notice" ? 1 : userId; // 1:admin
    notification.targetId = targetId;
    notification.url = ""; //TODO: 논의 필요//Notification.setUrlByType(type);
    notification.type = type;
    notification.title = Notification.setTitleByType(type, targetUser.nickname);

    return notification;
  }

  // type에 따른 알림 제목 설정
  static setTitleByType(type: NotificationType, nickname: string) {
    switch (type) {
      case "comment":
        return `💬 ${nickname}님이 내 글에 댓글을 남겼어요.`;
      case "reply":
        return `💬 ${nickname}님이 내 댓글에 답글을 남겼어요.`;
      case "likes":
        return `❤️ ${nickname}님이 내 글을 좋아합니다.`;
      case "trend":
        return `🤩 내 글이 인기게시글에 등록되었어요.`;
      case "notice":
        return `📣 새로운 공지사항이 있습니다.`; //TODO: 문의 답변 알림
    }
  }
}

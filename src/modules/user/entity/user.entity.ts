import { Entity, Column, OneToMany, Generated } from "typeorm";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Like } from "../../like/entity/like.entity";
import { LoginLog } from "../login-log/entity/login-log.entity";
import { UpdateLog } from "../update-log/entity/update-log.entity";
import { Notification } from "../../notifications/entity/notification.entity";
import { Post } from "../../post/entity/post.entity";
import { Report } from "../../report/entity/report.entity";
import { Survey } from "../../survey/entity/survey.entity";
import { Ask } from "../../ask/entity/ask.entity";
import { UserBase } from "./userbase";
import { Provider } from "../../../shared/type.shared";
import config from "../../../config";

const { status } = config.user;

@Entity()
export class User extends UserBase {
  @Generated("uuid")
  @Column({ type: "uuid" })
  uuid: string;

  @Column({
    type: "tinyint",
    default: 1,
    comment: "0:탈퇴 1:회원가입필요 2:정상 3:정지",
  })
  status: number;

  @Column({
    nullable: true,
    length: "4",
    comment: "유저 mbti",
  })
  mbti: string;

  @Column({
    nullable: true,
    length: "10",
    comment: "유저 닉네임 (min: 2, max: 10)",
    unique: true,
  })
  nickname: string;

  @Column({
    default: false,
    comment: "어드민 여부",
  })
  isAdmin: boolean;

  // User (1) <-> Like(*)
  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
  })
  likeId: Like[];

  // User (1) <-> Bookmark(*)
  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, {
    cascade: true,
  })
  bookmarkId: Bookmark[];

  // User (1) <-> Report(*)
  @OneToMany(() => Report, (report) => report.user, { cascade: true })
  reportId: Report[];

  // User (1) <-> LoginLog(*)
  @OneToMany(() => LoginLog, (loginLog) => loginLog.user, {
    cascade: true,
  })
  loginLogId: LoginLog[];

  // User (1) <-> UpdateLog(*)
  @OneToMany(() => UpdateLog, (updateLog) => updateLog.user, {
    cascade: true,
  })
  updateLogId: UpdateLog[];

  // User (1) <-> Notification(*)
  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notificationId: Notification[];

  // User (1) <-> Survey(*)
  @OneToMany(() => Survey, (survey) => survey.user, {
    cascade: true,
  })
  surveyId: Survey[];

  // User (1) <-> Post(*)
  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  postId!: Post[];

  // User (1) <-> Comment(*)
  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  commentId: Comment[];

  // User (1) <-> Ask(*)
  @OneToMany(() => Ask, (ask) => ask.user, { cascade: true })
  askId: Ask[];

  static of(
    provider: Provider,
    providerId: string,
    gender: number,
    ageRange: string
  ) {
    const user = new User();
    user.provider = provider;
    user.providerId = providerId;
    user.gender = gender;
    user.ageRange = ageRange;

    return user;
  }

  isActive() {
    // TODO: 회원가입 후 isActive: false임
    if (this.status === status.new || this.status === status.withdrawal)
      return false;
    return true;
  }

  isMy(entity: Comment | Post) {
    return this.id === entity.userId ? true : false;
  }
}

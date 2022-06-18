import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Like } from "../../like/entity/like.entity";
import { LoginLog } from "../../login-log/entity/login-log.entity";
import { Notification } from "../../notifications/entity/notification.entity";
import { Post } from "../../post/entity/post..entity";
import { Report } from "../../report/entity/report.entity";
import { Survey } from "../../survey/entity/survey.entity";

export type Provider = "kakao" | "naver";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
    length: "255",
    comment: "kakao | naver",
  })
  provider!: Provider;

  @Column({
    length: "255",
    comment: "소셜 계정 고유 아이디",
  })
  providerId!: string;

  @Column({ nullable: true, type: "text", comment: "소셜에서 받은 데이터" })
  providerData: string;

  @CreateDateColumn({ type: "datetime", comment: "생성 날짜시간" })
  datetime!: Date;

  @UpdateDateColumn({ type: "datetime", comment: "업데이트 날짜시간" })
  updateDatetime?: Date;

  @Column({
    type: "tinyint",
    default: 0,
    comment: "어드민 여부",
  })
  isAdmin!: boolean;

  // User (1) <-> Like(*)
  @OneToMany(() => Like, (like) => like.user, {
    cascade: true,
  })
  likeId!: Like[];

  // User (1) <-> Bookmark(*)
  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, {
    cascade: true,
  })
  bookmarkId!: Bookmark[];

  // User (1) <-> Report(*)
  @OneToMany(() => Report, (report) => report.user, { cascade: true })
  reportId!: Report[];

  // User (1) <-> LoginLog(*)
  @OneToMany(() => LoginLog, (loginLog) => loginLog.user, {
    cascade: true,
  })
  loginLogId!: LoginLog[];

  // User (1) <-> Notification(*)
  @OneToMany(() => Notification, (notification: any) => notification.user, {
    cascade: true,
  })
  notificationId!: Notification[];

  // User (1) <-> Survey(*)
  @OneToMany(() => Survey, (survey) => survey.user, {
    cascade: true,
  })
  surveyId!: Survey[];

  // User (1) <-> Post(*)
  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  postId!: Post[];

  // User (1) <-> Comment(*)
  @OneToMany(() => Comment, (comment: any) => comment.user, { cascade: true })
  commentId!: Comment[];
}
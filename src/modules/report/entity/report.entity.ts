import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
import { ReportTargetType } from "../../../shared/enum.shared";
import { ReportTargetTypeTransformer } from "../helper/report-target-type-transforemr";

import { User } from "../../user/entity/user.entity";

@Entity()
export class Report extends BaseEntity {
  @Column({ unsigned: true })
  userId: number;

  @Column({
    comment: "신고받은 게시글/댓글 아이디",
    unsigned: true,
  })
  targetId: number;

  @Column({
    type: "tinyint",
    comment: "1: 게시글, 2: 댓글",
    transformer: new ReportTargetTypeTransformer(),
  })
  targetType: number | ReportTargetType;

  @Column({ comment: "신고받은 유저 아이디" })
  targetUserId: number;

  @Column({ nullable: true, comment: "신고사유 (max: 200)", length: 200 })
  reason?: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  public static of(
    userId: number,
    targetId: number,
    targetType: ReportTargetType,
    targetUserId: number,
    reason?: string
  ) {
    const report = new Report();
    report.userId = userId;
    report.targetId = targetId;
    report.targetType = targetType;
    report.targetUserId = targetUserId;
    report.reason = reason ?? undefined;
    return report;
  }
}

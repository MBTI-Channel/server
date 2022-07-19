import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";

import { User } from "../../user/entity/user.entity";

@Entity()
export class LoginLog extends BaseEntity {
  @Column({
    length: "50",
    comment: "로그인한 ip",
  })
  ip: string;

  @Column({
    length: "255",
    comment: "로그인한 유저 에이전트",
  })
  useragent: string;

  @Column({
    comment: "유저 id",
    unsigned: true,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  static of(user: User, ip: string, userAgent: string) {
    const loginLog = new LoginLog();
    loginLog.user = user;
    loginLog.ip = ip;
    loginLog.useragent = userAgent;

    return loginLog;
  }
}

import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
import { UpdateLogType } from "../../../shared/type.shared";

import { User } from "../../user/entity/user.entity";

@Entity()
export class UpdateLog extends BaseEntity {
  @Column({
    length: "20",
    comment: "업데이트 종류",
  })
  type: UpdateLogType;

  @Column({
    length: "10",
    comment: "업데이트 전",
  })
  before: string;

  @Column({
    length: "10",
    comment: "업데이트 후",
  })
  after: string;

  @Column({ unsigned: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  static of(user: User, type: UpdateLogType, before: string, after: string) {
    const loginLog = new UpdateLog();
    loginLog.user = user;
    loginLog.type = type;
    loginLog.before = before;
    loginLog.after = after;
    return loginLog;
  }
}

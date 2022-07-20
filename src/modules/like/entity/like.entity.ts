import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";

import { User } from "../../user/entity/user.entity";

@Entity()
export class Like extends BaseEntity {
  @Column({
    comment: "추천한 게시글/댓글 id",
    unsigned: true,
  })
  targetId: number;

  @Column({
    type: "tinyint",
    comment: "1: 게시글 2; 댓글",
  })
  targetType: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;
}

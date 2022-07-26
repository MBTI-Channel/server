import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Post } from "../../post/entity/post.entity";

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

  @Column({ unsigned: true })
  userId: number;

  @Column({ default: true, comment: "좋아요 활성 여부" })
  isActive: boolean;

  static of(target: Post | Comment, user: User, type: number) {
    const like = new Like();
    like.user = user;
    like.targetId = target.id;
    like.targetType = type;
    return like;
  }
}

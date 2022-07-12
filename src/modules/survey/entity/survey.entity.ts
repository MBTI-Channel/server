import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";
import { Post } from "../../post/entity/post.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Survey extends BaseEntity {
  // Survey (*) <-> Post(1)
  @ManyToOne((type) => Post, (post) => post.id)
  post: Post;

  @Column()
  postId: number;

  // Survey (*) <-> User(1)
  @ManyToOne((type) => User, (user) => user.id)
  user: User;

  @Column()
  userId: number;

  @Column({ length: 4, comment: "참여한 유저 MBTI" })
  userMbti: string;

  @Column({ default: false, comment: "찬성 여부" })
  isAgree: boolean;
}

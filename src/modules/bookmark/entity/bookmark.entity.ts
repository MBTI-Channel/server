import { Entity, ManyToOne, Column } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";

import { Post } from "../../post/entity/post.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Bookmark extends BaseEntity {
  // User (1) <-> Bookmark (*)
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ unsigned: true })
  userId: number;

  // Post (1) <-> Bookmark (*)
  @ManyToOne(() => Post, (post) => post.bookmark)
  post: Post;

  @Column({ unsigned: true })
  postId: number;
}

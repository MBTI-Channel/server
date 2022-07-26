import { Entity, OneToOne, JoinColumn, Column } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";

import { Post } from "../../post/entity/post.entity";

@Entity()
export class Trend extends BaseEntity {
  @OneToOne(() => Post, (post: any) => post.id, { cascade: true })
  @JoinColumn()
  post: Post;

  @Column({ unsigned: true })
  postId: number;
}

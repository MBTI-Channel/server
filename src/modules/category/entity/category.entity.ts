import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";
import { Post } from "../../post/entity/post.entity";

@Entity()
export class Category extends BaseEntity {
  @Column({ comment: "카테고리 이름" })
  name: string;

  @Column({ default: true, comment: "카테고리 활성 여부" })
  isActive: boolean;

  // Category (1) <-> Post(*)
  @OneToMany((type) => Post, (post) => post.id, { cascade: true })
  post!: Post[];
}

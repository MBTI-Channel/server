import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Post } from "../../post/entity/post.entity";

@Entity("Category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "카테고리 이름" })
  name: string;

  @Column({ default: 0, comment: "카테고리 비활성 여부" })
  isDisabled: boolean;

  // Category (1) <-> Post(*)
  @OneToMany((type) => Post, (post) => post.id, { cascade: true })
  post!: Post[];
}

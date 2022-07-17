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

  static typeTo(type: string) {
    switch (type) {
      case "game":
        return 1;
      case "mbti":
        return 2;
      case "trip":
        return 3;
      case "love":
        return 4;
    }
  }

  static typeFrom(type: number) {
    switch (type) {
      case 1:
        return "game";
      case 2:
        return "mbti";
      case 3:
        return "trip";
      case 4:
        return "love";
    }
  }
}

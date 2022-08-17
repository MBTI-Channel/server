import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
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
      case "mbti":
        return 1;
      case "love":
        return 2;
      case "school":
        return 3;
      case "workLife":
        return 4;
      case "music":
        return 5;
      case "movie":
        return 6;
      case "trip":
        return 7;
      case "hobby":
        return 8;
      default:
        return 0;
    }
  }

  static typeFrom(type: number) {
    switch (type) {
      case 1:
        return "mbti";
      case 2:
        return "love";
      case 3:
        return "school";
      case 4:
        return "workLife";
      case 5:
        return "music";
      case 6:
        return "movie";
      case 7:
        return "trip";
      case 8:
        return "hobby";
    }
  }
}

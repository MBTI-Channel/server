import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { Post } from "./post..entity";
import { User } from "./user.entity";

@Entity("Bookmark")
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  // User (1) <-> Bookmark (*)
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user: User;

  // Post (1) <-> Bookmark (*)
  @ManyToOne(() => Post, (post) => post.bookmark)
  post: Post;

  @CreateDateColumn({ type: "datetime", comment: "북마크 한시간" })
  datetime?: Date | null;
}

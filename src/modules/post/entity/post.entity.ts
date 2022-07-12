import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { Category } from "../../category/entity/category.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Survey } from "../../survey/entity/survey.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  // Post (*) <-> Category (1)
  @ManyToOne((type) => Category, (category) => category.id)
  category!: Category;

  // Post (*) <-> User (1)
  @ManyToOne((type) => User, (user) => user.id)
  user!: User;

  @Column()
  userId: number;

  @Column({
    type: "tinyint",
    default: 1,
    comment: "게시글 종류 [1: post, 2: survey, 3: notice]",
  })
  type: number;

  @Column({ length: "4", comment: "작성자 MBTI" })
  userMbti: string;

  @Column({ length: "10", comment: "작성자 닉네임" })
  userNickname: string;

  @Column({
    type: "tinyint",
    default: 0,
    comment: "작성자 익명 여부 [0: 실명, 1: 익명]",
  })
  isSecret: boolean;

  @Column({ length: "30", comment: "게시글 제목" })
  title: string;

  @Column({ type: "text", comment: "게시글 내용" })
  content: string;

  @Column({ default: 0, comment: "조회수" })
  viewCount: number;

  @Column({ default: 0, comment: "댓글수" })
  commentCount: number;

  @Column({ default: 0, comment: "좋아요수" })
  likesCount: number;

  @Column({ default: 0, comment: "신고수" })
  reportCount: number;

  @Column({
    type: "tinyint",
    default: 0,
    comment: "게시글 비활성 여부 [0: 활성, 1: 비활성]",
  })
  isDisabled: boolean;

  @CreateDateColumn({
    comment: "게시글 생성 날짜시간",
  })
  datetime!: Date;

  @Column({ nullable: true, comment: "게시글 수정 날짜시간" })
  updateDatetime?: Date;

  // Post (1) <-> Comment (*)
  @OneToMany(() => Comment, (comment) => comment.id, { cascade: true })
  comment!: Comment[];

  // Post (1) <-> Bookmark (*)
  @OneToMany(() => Bookmark, (bookmark) => bookmark.id, { cascade: true })
  bookmark!: Bookmark[];

  // Post (1) <-> Survey (*)
  @OneToMany(() => Survey, (bookmark) => bookmark.id, { cascade: true })
  survey!: Survey[];

  isActive() {
    if (this.isDisabled === true) return false;
    return true;
  }
}

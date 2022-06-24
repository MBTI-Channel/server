import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Post } from "../../post/entity/post.entity";
import { User } from "../../user/entity/user.entity";

@Entity("Comment")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  // Comment (*) <-> Post (1)
  @ManyToOne((type) => Post, (post) => post.id)
  post!: Post;

  // Comment (*) <-> User (1)
  @ManyToOne((type) => User, (user) => user.id)
  user!: User;

  @Column({ nullable: true, comment: "태그한 댓글 아이디" })
  taggedId: number;

  @Column({ nullable: true, comment: "부모 댓글 아이디" })
  parentId: number;

  @Column({ length: 10, comment: "작성자 닉네임" })
  userNickname: string;

  @Column({ length: 4, comment: "작성자 MBTI" })
  userMbti: string;

  @Column({ default: 0, comment: "작성자 익명 여부" })
  isSecret: boolean;

  @Column({ type: "text", comment: "댓글 내용" })
  content: string;

  @Column({ default: 0, comment: "대댓글수" })
  replyCount: number;

  @Column({ default: 0, comment: "좋아요수" })
  likesCount: number;

  @Column({ default: 0, comment: "신고수" })
  reportCount: number;

  @Column({ comment: "댓글 비활성 여부" })
  isDisabled: boolean;

  @CreateDateColumn({
    default: () => "(CURRENT_DATE)",
    comment: "댓글 생성 날짜시간",
  })
  datetime: Date;

  @Column({ nullable: true, comment: "댓글 수정 날짜시간" })
  updateDatetime: Date;
}

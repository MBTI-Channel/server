import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";

import { Post } from "../../post/entity/post.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
export class Comment extends BaseEntity {
  // Comment (*) <-> Post (1)
  @ManyToOne((type) => Post, (post) => post.id)
  post: Post;

  @Column({ unsigned: true })
  postId: number;

  // Comment (*) <-> User (1)
  @ManyToOne((type) => User, (user) => user.id)
  user: User;

  @Column({ unsigned: true })
  userId: number;

  @Column({ nullable: true, comment: "태그한 댓글 아이디" })
  taggedId?: number;

  @Column({ nullable: true, comment: "부모 댓글 아이디" })
  parentId?: number;

  @Column({ nullable: true, length: 10, comment: "작성자 닉네임" })
  userNickname?: string;

  @Column({ length: 4, comment: "작성자 MBTI" })
  userMbti: string;

  @Column({ default: false, comment: "작성자 익명 여부" })
  isSecret: boolean;

  @Column({ type: "text", comment: "댓글 내용" })
  content: string;

  @Column({ default: 0, comment: "대댓글수" })
  replyCount: number;

  @Column({ default: 0, comment: "좋아요수" })
  likesCount: number;

  @Column({ default: 0, comment: "신고수" })
  reportCount: number;

  @Column({ default: true, comment: "댓글 활성 여부" })
  isActive: boolean;

  @Column({ default: false, comment: "게시글 작성자 여부" })
  isPostWriter: boolean;

  static of(post: Post, user: User, content: string, isSecret: boolean) {
    const comment = new Comment();
    comment.post = post;
    comment.user = user;
    comment.userNickname = isSecret ? undefined : user.nickname;
    comment.userMbti = user.mbti;
    comment.content = content;
    comment.isSecret = isSecret;
    comment.isPostWriter = post.userId === user.id ? true : false;
    return comment;
  }

  static replyOf(
    post: Post,
    user: User,
    content: string,
    isSecret: boolean,
    parentId: number,
    taggedId: number
  ) {
    const reply = Comment.of(post, user, content, isSecret);
    reply.parentId = parentId;
    reply.taggedId = taggedId;
    return reply;
  }
}

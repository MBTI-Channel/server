import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity";
import { PostType } from "../../../shared/enum.shared";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { Category } from "../../category/entity/category.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Survey } from "../../survey/entity/survey.entity";
import { User } from "../../user/entity/user.entity";
import { PostTypeTransformer } from "../helper/post-type-transformer";

@Entity()
export class Post extends BaseEntity {
  // Post (*) <-> Category (1)
  @ManyToOne((type) => Category, (category) => category.id)
  category!: Category;

  // Post (*) <-> User (1)
  @ManyToOne((type) => User, (user) => user.id)
  user!: User;

  @Column({ unsigned: true })
  userId: number;

  @Column({ comment: "카테고리 id", unsigned: true })
  categoryId: number;

  @Column({
    type: "tinyint",
    default: 1,
    transformer: new PostTypeTransformer(),
    comment: "게시글 종류 [1: post, 2: mbti, 3: survey, 4: notice]",
  })
  type: number | PostType;

  @Column({ length: "4", comment: "작성자 MBTI" })
  userMbti: string;

  @Column({ nullable: true, length: "10", comment: "작성자 닉네임" })
  userNickname?: string;

  @Column({
    default: false,
    comment: "작성자 익명 여부",
  })
  isSecret: boolean;

  @Column({
    default: false,
    comment: "게시글 인기글 여부",
  })
  isTrend: boolean;

  @Column({
    type: "text",
    nullable: true,
    comment: "썸네일 이미지 url",
  })
  thumbnail?: string;

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
    default: true,
    comment: "게시글 활성 여부",
  })
  isActive: boolean;

  // Post (1) <-> Comment (*)
  @OneToMany(() => Comment, (comment) => comment.id, { cascade: true })
  comment: Comment[];

  // Post (1) <-> Bookmark (*)
  @OneToMany(() => Bookmark, (bookmark) => bookmark.id, { cascade: true })
  bookmark: Bookmark[];

  // Post (1) <-> Survey (*)
  @OneToMany(() => Survey, (bookmark) => bookmark.id, { cascade: true })
  survey: Survey[];

  static of(
    user: User,
    category: Category,
    isSecret: boolean,
    thumbnail: string | null,
    title: string,
    content: string,
    postType: PostType
  ) {
    const post = new Post();
    post.user = user;
    post.category = category;
    post.isSecret = isSecret;
    post.thumbnail = thumbnail ?? undefined;
    post.title = title;
    post.content = content;
    post.type = postType;
    post.userNickname = isSecret ? undefined : user.nickname;
    post.userMbti = user.mbti;

    return post;
  }
}

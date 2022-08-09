import { PostType } from "../../../shared/enum.shared";
import { Post } from "../../post/entity/post.entity";
import { Trend } from "../entity/trend.entity";

export class TrendResponseDto {
  id: number;
  categoryId: number;
  isActive: boolean;
  type: PostType;
  postId: number;
  userId: number;
  userMbti: string;
  userNickname: string | null;
  isSecret: boolean;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likesCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  constructor(trend: Trend, post: Post) {
    this.id = trend.id;
    this.type = post.type as PostType;
    this.postId = post.id;
    this.categoryId = post.categoryId;
    this.isActive = post.isActive;
    this.userId = post.userId;
    this.userMbti = post.userMbti;
    this.userNickname = post.userNickname ?? null; // null은 익명일 경우
    this.isSecret = post.isSecret;
    this.title = post.title;
    this.content = post.content;
    this.viewCount = post.viewCount;
    this.commentCount = post.commentCount;
    this.likesCount = post.likesCount;
    this.reportCount = post.reportCount;
    this.createdAt = post.createdAt;
    this.updatedAt =
      post.createdAt.getTime() === post.updatedAt.getTime()
        ? null
        : post.updatedAt;
  }
}

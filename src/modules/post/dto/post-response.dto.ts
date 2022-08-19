import { PostType } from "../../../shared/enum.shared";
import { User } from "../../user/entity/user.entity";
import { Post } from "../entity/post.entity";

export class PostResponseDto {
  id: number;
  categoryId: number;
  type: PostType;
  isActive: boolean;
  isActiveUser: boolean = true;
  isMy: boolean = false;
  userId: number;
  userMbti: string;
  userNickname: string | null;
  isSecret: boolean;
  thumbnail: string | null;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likesCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  constructor(post: Post, user: User) {
    this.id = post.id;
    this.type = post.type as PostType;
    this.categoryId = post.categoryId;
    this.isActive = post.isActive;
    this.isMy = user ? user.isMy(post) : false;
    this.userId = post.userId;
    this.userMbti = post.userMbti;
    this.userNickname = post.userNickname ?? null; // null은 익명일 경우
    this.isSecret = post.isSecret;
    this.thumbnail = post.thumbnail ?? null; // null은 이미지가 존재하지 않는 경우
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

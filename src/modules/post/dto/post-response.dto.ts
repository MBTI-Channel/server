import { User } from "../../user/entity/user.entity";
import { Post } from "../entity/post.entity";

export class PostResponseDto {
  id: number;
  categoryId: number;
  type: number;
  isActive: boolean;
  isActiveUser: boolean = true;
  isMy: boolean = false;
  userId: number;
  userMbti: string;
  userNickname: string;
  isSecret: boolean;
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
    this.type = post.type;
    this.categoryId = post.categoryId;
    this.isActive = post.isActive;
    this.isActiveUser = user ? user.isActive() : false;
    this.isMy = user ? user.isMy(post) : false;
    this.userId = post.userId;
    this.userMbti = post.userMbti;
    this.userNickname = post.userNickname ?? "";
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

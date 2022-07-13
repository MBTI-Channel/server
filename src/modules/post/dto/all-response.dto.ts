import { Post } from "../entity/post.entity";

export class PostResponseDto {
  id: number;
  categoryId: number;
  type: number;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor(post: Post) {
    this.id = post.id;
    this.type = post.type;
    this.categoryId = post.categoryId;
    this.userId = post.userId;
    this.userMbti = post.userMbti;
    this.userNickname = post.userNickname;
    this.isSecret = post.isSecret;
    this.title = post.title;
    this.content = post.content;
    this.viewCount = post.viewCount;
    this.commentCount = post.commentCount;
    this.likesCount = post.likesCount;
    this.reportCount = post.reportCount;
    this.isActive = post.isActive;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}

export class PostCreateResponseDto {
  id: number;
  constructor(post: Post) {
    this.id = post.id;
  }
}

export class SearchDetailResponseDto extends PostResponseDto {
  isActiveUser: boolean;
  isMy: boolean;
  constructor(post: Post, isActiveUser: boolean, isMy: boolean) {
    super(post);
    this.isActiveUser = isActiveUser;
    this.isMy = isMy;
  }
}

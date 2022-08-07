import { User } from "../../user/entity/user.entity";
import { Comment } from "../entity/comment.entity";

export class UserCommentResponseDto {
  // comment info
  id: number;
  content: string;
  isActive: boolean;
  replyCount: number;
  likesCount: number;
  isMy: boolean = true;
  isPostWriter: boolean = false;
  createdAt: Date;
  updatedAt: Date | null;
  // post info
  postId: number;
  postTitle: string;
  postCommentsCount: number;
  isActivePost: boolean;

  constructor(entity: Comment, user: User) {
    this.id = entity.id;
    this.content = entity.content;
    this.isActive = entity.isActive;
    this.replyCount = entity.replyCount;
    this.likesCount = entity.likesCount;
    this.isPostWriter = entity.isPostWriter;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    // post info
    this.postId = entity.post.id;
    this.postTitle = entity.post.title;
    this.postCommentsCount = entity.post.commentCount;
    this.isActivePost = entity.post.isActive;
  }
}

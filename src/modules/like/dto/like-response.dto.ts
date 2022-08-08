import { Comment } from "../../comment/entity/comment.entity";
import { Post } from "../../post/entity/post.entity";
import { Like } from "../entity/like.entity";

export class LikeResponseDto {
  targetId: number;
  targetType: string;
  userId: number;
  userNickname: string | null;
  userMbti: string;
  isSecret: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(target: Post | Comment, entity: Like) {
    this.targetId = target.id;
    this.targetType = entity.targetType === 1 ? "post" : "comment";
    this.isSecret = target.isSecret;
    this.isActive = target.isActive;
    this.userId = target.userId;
    this.userNickname = target.userNickname ?? null; // null은 익명일 경우
    this.userMbti = target.userMbti;
    this.createdAt = target.createdAt;
    this.updatedAt =
      target.createdAt.getTime() === target.updatedAt.getTime()
        ? null
        : target.updatedAt;
  }
}

import { User } from "../../user/entity/user.entity";
import { Comment } from "../entity/comment.entity";

export class CommentResponseDto {
  id: number;
  userId: number;
  userNickname: string | null;
  userMbti: string;
  isSecret: boolean;
  content: string;
  isActive: boolean;
  replyCount: number;
  likesCount: number;
  isMy: boolean = false;
  isPostWriter: boolean = false;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(entity: Comment, user: User) {
    this.isSecret = entity.isSecret;
    this.isActive = entity.isActive;
    this.isMy = user ? user.isMy(entity) : false;
    this.isPostWriter = entity.isPostWriter;
    this.id = entity.id;
    // 미로그인 상태일 수 있기때문에 user ? 삼항연산자 사용
    this.userId = entity.userId;
    this.userNickname = entity.userNickname ?? null; // null은 익명일 경우
    this.userMbti = entity.userMbti;
    this.content = this.isActive === true ? entity.content : "";
    this.replyCount = entity.replyCount;
    this.likesCount = entity.likesCount;
    this.createdAt = entity.createdAt;
    this.updatedAt =
      entity.createdAt.getTime() === entity.updatedAt.getTime()
        ? null
        : entity.updatedAt;
  }
}

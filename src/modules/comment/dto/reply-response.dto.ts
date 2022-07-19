import { User } from "../../user/entity/user.entity";
import { Comment } from "../entity/comment.entity";

export class ReplyResponseDto {
  isMy: boolean = false;
  isPostWriter: boolean = false;
  isSecret: boolean;
  isActive: boolean;
  id: number;
  userId: number;
  userNickname: string;
  userMbti: string;
  content: string;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date | null;

  constructor(entity: Comment, user: User) {
    this.isSecret = entity.isSecret;
    this.isActive = entity.isActive;
    // 미로그인 상태일 수 있기때문에 user ? 삼항연산자 사용
    this.isMy = user ? user.isMy(entity) : false;
    this.isPostWriter = entity.isPostWriter;
    this.id = entity.id;
    this.userId = entity.userId;
    this.userNickname = entity.userNickname ?? "";
    this.userMbti = entity.userMbti;
    this.content = this.isActive === true ? entity.content : "";
    this.likesCount = entity.likesCount;
    this.createdAt = entity.createdAt;
    this.updatedAt =
      entity.createdAt.getTime() === entity.updatedAt.getTime()
        ? null
        : entity.updatedAt;
  }
}

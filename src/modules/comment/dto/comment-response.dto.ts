import { User } from "../../user/entity/user.entity";
import { Comment } from "../entity/comment.entity";

export class CommentResponseDto {
  id: number;
  userId: number;
  userNickname: string;
  userMbti: string;
  isSecret: boolean;
  content: string;
  isActive: boolean;
  replyCount: number;
  likesCount: number;
  isMy: boolean = false;
  isPostWriter: boolean = false;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: Comment, user: User) {
    this.isSecret = entity.isSecret;
    this.isActive = entity.isActive;
    this.isMy = user ? user.isMy(entity) : false;
    this.isPostWriter = entity.isPostWriter;
    this.id = entity.id;
    // 미로그인 상태일 수 있기때문에 user ? 삼항연산자 사용
    this.userId = entity.userId;
    this.userNickname = entity.userNickname ?? "";
    this.userMbti = entity.userMbti;
    this.content = this.isActive === true ? entity.content : "";
    this.replyCount = entity.replyCount;
    this.likesCount = entity.likesCount;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

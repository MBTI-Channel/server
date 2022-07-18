import { User } from "../../user/entity/user.entity";
import { Comment } from "../entity/comment.entity";
import { CommentResponseDto } from "./comment-response.dto";

export class ReplyResponseDto extends CommentResponseDto {
  parentId: number;
  taggedI: number;
  constructor(entity: Comment, user: User) {
    super(entity, user);
    this.parentId = entity.parentId!;
    this.taggedI = entity.taggedId!;
  }
}

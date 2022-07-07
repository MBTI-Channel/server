import { User } from "../../user/entity/user.entity";
import { Comment } from "../entity/comment.entity";

export interface ICommentRepository {
  createComment(commentEntity: Comment): Promise<Comment>;
  // findAllCommentByPostId(user:User, postId: number): Promise<Comment[]|null>;
  // findAllReplyByCommentId(user:User, commentId:number): Promise<Comment[]|null>;
}

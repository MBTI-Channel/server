import { Comment } from "../entity/comment.entity";

export interface ICommentRepository {
  createComment(commentEntity: Comment): Promise<Comment>;
  findById(id: number): Promise<Comment | null>;
  // findAllCommentByPostId(user:User, postId: number): Promise<Comment[]|null>;
  // findAllReplyByCommentId(user:User, commentId:number): Promise<Comment[]|null>;
  remove(id: number): Promise<void>;
}

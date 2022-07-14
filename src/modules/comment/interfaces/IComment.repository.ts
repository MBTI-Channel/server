import { GetAllCommentDto } from "../dto/get-all-comment.dto";
import { Comment } from "../entity/comment.entity";

export interface ICommentRepository {
  createComment(commentEntity: Comment): Promise<Comment>;
  findById(id: number): Promise<Comment | null>;
  findAllComments(
    pageOptionsDto: GetAllCommentDto
  ): Promise<[Comment[], number]>;
  // findAllReplyByCommentId(user:User, commentId:number): Promise<Comment[]|null>;
  remove(id: number): Promise<void>;
}

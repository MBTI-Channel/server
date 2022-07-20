import { GetAllCommentDto } from "../dto/get-all-comment.dto";
import { Comment } from "../entity/comment.entity";

export interface ICommentRepository {
  createComment(commentEntity: Comment): Promise<Comment>;
  findById(id: number): Promise<Comment | null>;
  findAllComments(
    pageOptionsDto: GetAllCommentDto
  ): Promise<[Comment[], number]>;
  update(id: number, content: Partial<Comment>): Promise<Comment>;
  increaseReplyCount(id: number): Promise<boolean>;
  remove(id: number): Promise<void>;
}

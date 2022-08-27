import { GetAllByUserDto, GetAllCommentDto, GetAllRepliesDto } from "../dto";
import { Comment } from "../entity/comment.entity";

export interface ICommentRepository {
  createComment(commentEntity: Comment): Promise<Comment>;
  findOneById(id: number): Promise<Comment | null>;
  findAllComments(
    pageOptionsDto: GetAllCommentDto
  ): Promise<[Comment[], number]>;
  findAllReplies(pageOptionsDto: GetAllRepliesDto): Promise<Comment[]>;
  findAllByUser(
    pageOptionsDto: GetAllByUserDto,
    userId: number
  ): Promise<[Comment[], number]>;
  update(id: number, content: Partial<Comment>): Promise<boolean>;
  increaseReportCount(id: number): Promise<boolean>;
  increaseReplyCount(id: number): Promise<boolean>;
  increaseLikeCount(id: number): Promise<boolean>;
  decreaseLikeCount(id: number): Promise<boolean>;
  remove(id: number): Promise<void>;
}

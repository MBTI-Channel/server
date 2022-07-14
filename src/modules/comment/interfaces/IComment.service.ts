import { User } from "../../user/entity/user.entity";
import { GetAllCommentDto, CommentResponseDto } from "../dto";
import { PageInfoDto, PageResponseDto } from "../../../shared/page";

export interface ICommentService {
  createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<CommentResponseDto>;
  findAllComments(
    pageOptionsDto: GetAllCommentDto,
    user: User
  ): Promise<PageResponseDto<PageInfoDto, CommentResponseDto>>;
  delete(user: User, id: number): Promise<void>;
  // createReply(
  //   user: User,
  //   postId: number,
  //   commentId: number,
  //   content: string,
  //   isSecret: boolean
  // ): Promise<any>;
  // findAllReply(
  //   user: User,
  //   commentId: number,
  //   startId: number,
  //   size: number
  // ): Promise<any>;
}

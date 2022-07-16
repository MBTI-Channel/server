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
  // createReply(
  //   user: User,
  //   content: string,
  //   isSecret: boolean,
  //   postId: number,
  //   parentId: number,
  //   taggedId: number
  // ): Promise<any>;
  // postId  게시글 아이디
  // commentId 댓글 아이디
  // taggedId? 태그한 댓글 아이디
  // content 대댓글 내용
  findAllComments(
    pageOptionsDto: GetAllCommentDto,
    user: User
  ): Promise<PageResponseDto<PageInfoDto, CommentResponseDto>>;
  update(user: User, id: number, content: string): Promise<CommentResponseDto>;
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

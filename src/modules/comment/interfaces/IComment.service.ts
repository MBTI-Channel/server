import { User } from "../../user/entity/user.entity";
import { GetAllCommentDto, CommentResponseDto, ReplyResponseDto } from "../dto";
import {
  PageInfiniteScrollInfoDto,
  PageInfoDto,
  PageResponseDto,
} from "../../../shared/page";
import { GetAllRepliesDto } from "../dto/get-all-replies.dto";

export interface ICommentService {
  createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<CommentResponseDto>;
  createReply(
    user: User,
    postId: number,
    parentId: number,
    taggedId: number | undefined,
    content: string,
    isSecret: boolean
  ): Promise<ReplyResponseDto>;
  findAllComments(
    pageOptionsDto: GetAllCommentDto,
    user: User
  ): Promise<PageResponseDto<PageInfoDto, CommentResponseDto>>;
  findAllReplies(
    pageOptionsDto: GetAllRepliesDto,
    user: User
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, ReplyResponseDto>>;
  increaseLikeCount(id: number): Promise<void>;
  update(user: User, id: number, content: string): Promise<CommentResponseDto>;
  delete(user: User, id: number): Promise<void>;
}

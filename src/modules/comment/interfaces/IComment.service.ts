import { User } from "../../user/entity/user.entity";
import {
  GetAllCommentDto,
  GetAllRepliesDto,
  GetAllByUserDto,
  CommentResponseDto,
  ReplyResponseDto,
  UserCommentResponseDto,
} from "../dto";
import {
  PageInfiniteScrollInfoDto,
  PageInfoDto,
  PageResponseDto,
} from "../../../shared/page";

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
  getAllComments(
    pageOptionsDto: GetAllCommentDto,
    user: User
  ): Promise<PageResponseDto<PageInfoDto, CommentResponseDto>>;
  getAllReplies(
    pageOptionsDto: GetAllRepliesDto,
    user: User
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, ReplyResponseDto>>;
  getAllByUser(
    user: User,
    pageOptionsDto: GetAllByUserDto
  ): Promise<PageResponseDto<PageInfoDto, UserCommentResponseDto>>;
  increaseReportCount(id: number): Promise<void>;
  increaseLikeCount(id: number): Promise<void>;
  decreaseLikeCount(id: number): Promise<void>;
  update(user: User, id: number, content: string): Promise<CommentResponseDto>;
  remove(user: User, id: number): Promise<void>;
  isValid(id: number): Promise<boolean>;
}

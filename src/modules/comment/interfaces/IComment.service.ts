import { User } from "../../user/entity/user.entity";
import { CommentResponseDto } from "../dto/all-response.dto";

export interface ICommentService {
  createComment(
    user: User,
    postId: number,
    content: string,
    isSecret: boolean
  ): Promise<CommentResponseDto>;
  // findAllComment(
  //   user: User,
  //   postId: number,
  //   page: number,
  //   size: number
  // ): Promise<any>;
  // update(user: User, id: number, content: string): Promise<any>;
  // delete(user: User, id: number): Promise<any>;
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

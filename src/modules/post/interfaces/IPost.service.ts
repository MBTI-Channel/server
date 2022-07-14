import { User } from "../../user/entity/user.entity";
import { PostResponseDto } from "../dto/post-response.dto";

export interface IPostService {
  create(
    isSecret: boolean,
    title: string,
    content: string,
    categoryId: number,
    user: User
  ): Promise<PostResponseDto>;
  increaseCommentCount(id: number): Promise<void>;
  delete(user: User, id: number): Promise<void>;
  getDetail(user: User, id: number): Promise<PostResponseDto>;
  isValid(id: number): Promise<boolean>;
}

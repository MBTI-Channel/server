import { User } from "../../user/entity/user.entity";
import {
  PostCreateResponseDto,
  getDetailResponseDto,
} from "../dto/all-response.dto";

export interface IPostService {
  create(
    isSecret: boolean,
    title: string,
    content: string,
    categoryId: number,
    user: User
  ): Promise<PostCreateResponseDto>;
  increaseCommentCount(id: number): Promise<void>;
  delete(user: User, id: number): Promise<void>;
  getDetail(user: User, id: number): Promise<getDetailResponseDto>;
  isValid(id: number): Promise<boolean>;
}

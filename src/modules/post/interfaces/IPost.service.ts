import { User } from "../../user/entity/user.entity";
import {
  PostCreateResponseDto,
  SearchDetailResponseDto,
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
  searchDetail(user: User, id: number): Promise<SearchDetailResponseDto>;
}

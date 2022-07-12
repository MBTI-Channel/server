import { User } from "../../user/entity/user.entity";
import { PostCreateResponseDto } from "../dto/all-response.dto";
import { SearchDetailPostDto } from "../dto/search-detail-post.dto";

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
  searchDetail(user: User, id: number): Promise<SearchDetailPostDto>;
}

import { Category } from "../../category/entity/category.entity";
import { User } from "../../user/entity/user.entity";
import { PostCreateResponseDto } from "../dto/all-response.dto";

export interface IPostService {
  create(
    isSecret: boolean,
    title: string,
    content: string,
    category: Category,
    user: User
  ): Promise<PostCreateResponseDto>;
}

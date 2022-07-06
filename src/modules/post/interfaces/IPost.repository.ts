import { Category } from "../../category/entity/category.entity";
import { User } from "../../user/entity/user.entity";
import { Post } from "../entity/post.entity";

export interface IPostRepository {
  createEntity(
    isSecret: boolean,
    title: string,
    content: string,
    userMbti: string,
    userNickname: string,
    category: Category,
    user: User
  ): Promise<Post>;
  create(postEntity: Post): Promise<Post>;
}

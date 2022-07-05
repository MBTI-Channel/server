import { Post } from "../entity/post.entity";

export interface IPostRepository {
  createPost(
    categoryId: number,
    isSecret: boolean,
    title: string,
    content: string,
    userMbti: string,
    userNickname: string
  ): Promise<Post>;
}

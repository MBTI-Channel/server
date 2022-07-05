import { Post } from "../entity/post.entity";

export interface IPostRepository {
  createEntity(
    categoryId: number,
    isSecret: boolean,
    title: string,
    content: string,
    userMbti: string,
    userNickname: string
  ): Promise<Post>;
  create(postEntity: Post): Promise<Post>;
}

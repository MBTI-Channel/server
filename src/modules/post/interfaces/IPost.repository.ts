import { Post } from "../entity/post.entity";

export interface IPostRepository {
  create(postEntity: Post): Promise<Post>;
  findOneById(id: number): Promise<Post | null>;
  increaseCommentCount(id: number): Promise<boolean>;
  remove(id: number): Promise<void>;
}

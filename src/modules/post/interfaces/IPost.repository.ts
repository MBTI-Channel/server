import { GetAllPostDto } from "../dto/get-all-post.dto";
import { Post } from "../entity/post.entity";

export interface IPostRepository {
  create(postEntity: Post): Promise<Post>;
  findOneById(id: number): Promise<Post | null>;
  increaseCommentCount(id: number): Promise<boolean>;
  remove(id: number): Promise<void>;
  findAllPosts(
    pageOptionsDto: GetAllPostDto,
    categoryId: number
  ): Promise<[Post[], number]>;
  findAllPostsWithMbti(
    pageOptionsDto: GetAllPostDto,
    categoryId: number,
    mbti: string
  ): Promise<[Post[], number]>;
}

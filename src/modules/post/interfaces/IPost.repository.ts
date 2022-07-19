import { GetAllPostDto } from "../dto/get-all-post.dto";
import { SearchPostDto } from "../dto/search-post.dto";
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
  update(id: number, payload: Partial<Post>): Promise<Post>;
  searchCategoryPosts(
    pageOptionsDto: SearchPostDto,
    categoryId: number
  ): Promise<[Post[], number]>;
  searchCategoryPostsWithMbti(
    pageOptionsDto: SearchPostDto,
    categoryId: number,
    mbti: string
  ): Promise<[Post[], number]>;
  searchAllPostsWithLoggedIn(): Promise<[Post[], number]>;
  searchAllPostsWithGuest(
    pageOptionsDto: SearchPostDto
  ): Promise<[Post[], number]>;
}

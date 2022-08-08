import { GetMyPostsDto } from "../dto";
import { GetAllPostDto } from "../dto/get-all-post.dto";
import { SearchPostDto } from "../dto/search-post.dto";
import { Post } from "../entity/post.entity";

export interface IPostRepository {
  create(postEntity: Post): Promise<Post>;
  findOneById(id: number): Promise<Post | null>;
  increaseCommentCount(id: number): Promise<boolean>;
  increaseLikeCount(id: number): Promise<boolean>;
  decreaseLikeCount(id: number): Promise<boolean>;
  increaseViewCount(id: number): Promise<boolean>;
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
  findAllByUserId(
    pageOptionsDto: GetMyPostsDto,
    userId: number
  ): Promise<[Post[], number]>;
  searchInCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number
  ): Promise<[Post[], number]>;
  searchInMbtiCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number,
    mbti: string
  ): Promise<[Post[], number]>;
  searchAll(): Promise<[Post[], number]>;
  searchWithoutMbtiCategory(
    pageOptionsDto: SearchPostDto
  ): Promise<[Post[], number]>;
}

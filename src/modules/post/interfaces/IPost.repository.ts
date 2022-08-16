import {
  GetMyPostsDto,
  GetAllPostDto,
  GetTrendDto,
  SearchPostDto,
} from "../dto";
import { Post } from "../entity/post.entity";

export interface IPostRepository {
  create(postEntity: Post): Promise<Post>;
  findOneById(id: number): Promise<Post | null>;
  increaseReportCount(id: number): Promise<boolean>;
  increaseCommentCount(id: number): Promise<boolean>;
  increaseLikeCount(id: number): Promise<boolean>;
  decreaseLikeCount(id: number): Promise<boolean>;
  increaseViewCount(id: number): Promise<boolean>;
  remove(id: number): Promise<void>;
  findAllPosts(
    pageOptionsDto: GetAllPostDto,
    categoryId: number
  ): Promise<Post[]>;
  findAllPostsWithMbti(
    pageOptionsDto: GetAllPostDto,
    categoryId: number,
    mbti: string
  ): Promise<Post[]>;
  update(id: number, payload: Partial<Post>): Promise<Post>;
  findAllByUserId(
    pageOptionsDto: GetMyPostsDto,
    userId: number
  ): Promise<[Post[], number]>;
  searchInCategory(
    pageOptionsDto: SearchPostDto,
    categoryId: number
  ): Promise<Post[]>;
  searchInMbtiCategory(
    pageOptionsDto: SearchPostDto,
    mbti: string
  ): Promise<Post[]>;
  findAllTrends(pageOptionsDto: GetTrendDto): Promise<Post[]>;
  searchAllWithMbti(
    pageOptionsDto: SearchPostDto,
    mbti: string
  ): Promise<Post[]>;
  searchWithoutMbtiCategory(pageOptionsDto: SearchPostDto): Promise<Post[]>;
}

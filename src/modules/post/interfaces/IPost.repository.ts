import { CategoryName } from "../../../shared/enum.shared";
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
  update(id: number, payload: Partial<Post>): Promise<boolean>;
  findAllByUserId(
    pageOptionsDto: GetMyPostsDto,
    userId: number
  ): Promise<[Post[], number]>;
  searchInMbtiCategory(
    pageOptionsDto: SearchPostDto,
    mbti: string
  ): Promise<Post[]>;
  searchInCategory(
    pageOptionsDto: SearchPostDto,
    category: number
  ): Promise<Post[]>;
  findAllTrends(pageOptionsDto: GetTrendDto): Promise<Post[]>;
  searchAllWithMbti(
    pageOptionsDto: SearchPostDto,
    mbti: string
  ): Promise<Post[]>;
  searchAllWithoutMbtiCategory(pageOptionsDto: SearchPostDto): Promise<Post[]>;
}

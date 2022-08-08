import {
  PageInfiniteScrollInfoDto,
  PageResponseDto,
} from "../../../shared/page";
import { User } from "../../user/entity/user.entity";
import { GetMyPostsDto } from "../dto";
import { GetAllPostDto } from "../dto/get-all-post.dto";
import { PostResponseDto } from "../dto/post-response.dto";
import { SearchPostDto } from "../dto/search-post.dto";

export interface IPostService {
  create(
    isSecret: boolean,
    title: string,
    content: string,
    categoryId: number,
    user: User
  ): Promise<PostResponseDto>;
  increaseReportCount(id: number): Promise<void>;
  increaseCommentCount(id: number): Promise<void>;
  increaseLikeCount(id: number): Promise<void>;
  decreaseLikeCount(id: number): Promise<void>;
  delete(user: User, id: number): Promise<void>;
  getDetail(user: User, id: number): Promise<PostResponseDto>;
  isValid(id: number): Promise<boolean>;
  getMyPosts(user: User, pageOptionsDto: GetMyPostsDto): Promise<any>; // TODO: 리턴타입, postService.getUserPosts로
  getAll(
    user: User,
    pageOptionsDto: GetAllPostDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>>;
  update(
    user: User,
    id: number,
    title: string,
    content: string,
    isSecret: boolean
  ): Promise<PostResponseDto>;
  search(
    user: User,
    pageOptionsDto: SearchPostDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>>;
}

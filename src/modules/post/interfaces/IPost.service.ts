import {
  PageInfiniteScrollInfoDto,
  PageResponseDto,
} from "../../../shared/page";
import { User } from "../../user/entity/user.entity";
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
  increaseCommentCount(id: number): Promise<void>;
  delete(user: User, id: number): Promise<void>;
  getDetail(user: User, id: number): Promise<PostResponseDto>;
  isValid(id: number): Promise<boolean>;
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
    pageOptionsDto: SearchPostDto,
    searchWord: string
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, PostResponseDto>>;
}

import { PostCreateResponseDto } from "../dto/all-response.dto";

export interface IPostService {
  create(
    categoryId: number,
    isSecret: boolean,
    title: string,
    content: string,
    mbti: string,
    nickname: string
  ): Promise<PostCreateResponseDto>;
}

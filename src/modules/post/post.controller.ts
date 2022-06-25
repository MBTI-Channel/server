import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import { bodyValidator } from "../../middlewares/validator.middleware";
import { CreatePostDto } from "./dto";
import { PostService } from "./post.service";

@controller("/posts")
export class PostController extends BaseHttpController {
  @inject(TYPES.IPostService) private readonly postService: PostService;
  // 게시글 생성
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreatePostDto)
  )
  async createPost(
    @requestBody() body: CreatePostDto,
    req: Request,
    res: Response
  ) {
    // body.userMbti = req.user?.mbti!;
    // body.userNickname = req.user?.nickname!;

    // test
    body.userMbti = "INFP";
    body.userNickname = "nickname2";
    return await this.postService.create(body);
  }
}

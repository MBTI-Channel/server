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
import { User } from "../user/entity/user.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { IPostService } from "./interfaces/IPost.service";

@controller("/posts")
export class PostController extends BaseHttpController {
  @inject(TYPES.IPostService) private readonly _postService: IPostService;

  // 게시글 등록
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
    const { categoryId, isSecret, title, content } = body;
    const user = req.user as User;

    const data = await this._postService.create(
      isSecret,
      title,
      content,
      categoryId,
      user
    );

    return res.status(201).json(data);
  }
}

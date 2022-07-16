import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  queryParam,
  requestBody,
  requestParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import {
  bodyValidator,
  paramsValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import { IdDto, CreatePostDto, GetAllPostDto } from "./dto";
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

  // 게시글 삭제
  @httpDelete(
    "/:id",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(IdDto)
  )
  async deletePost(@requestParam() param: IdDto, req: Request, res: Response) {
    const user = req.user as User;
    const { id } = param;

    await this._postService.delete(user, id);

    return res.status(200).json({ id });
  }

  // 게시글 상세 조회
  @httpGet("/:id", TYPES.CheckLoginStatusMiddleware, paramsValidator(IdDto))
  async getDetailPost(
    @requestParam() param: IdDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;

    const data = await this._postService.getDetail(user, id);
    return res.status(200).json(data);
  }

  // 게시글 전체 조회
  @httpGet("/", TYPES.CheckLoginStatusMiddleware, queryValidator(GetAllPostDto))
  async getAllPosts(
    @queryParam() query: GetAllPostDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    console.log(typeof query.startId);
    const data = await this._postService.getAll(user, query);
    return res.status(200).json(data);
  }
}

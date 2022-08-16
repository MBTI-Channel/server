import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  queryParam,
  requestBody,
  requestParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import {
  bodyValidator,
  paramsValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import {
  CreatePostDto,
  GetAllPostDto,
  SearchPostDto,
  UpdatePostDto,
  GetTrendDto,
} from "./dto";
import { IPostService } from "./interfaces/IPost.service";
import { IdDto } from "../../shared/dto/id.dto";

@controller("/posts")
export class PostController {
  @inject(TYPES.IPostService) private readonly _postService: IPostService;

  // 게시글 등록
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreatePostDto)
  )
  public async createPost(
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
  public async deletePost(
    @requestParam() param: IdDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;

    await this._postService.delete(user, id);

    return res.status(204).end();
  }

  // 게시글 검색
  @httpGet(
    "/search",
    TYPES.CheckLoginStatusMiddleware,
    queryValidator(SearchPostDto)
  )
  public async searchPost(
    @queryParam() query: SearchPostDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;

    const data = await this._postService.search(user, query);
    return res.status(200).json(data);
  }

  // 인기게시글 조회
  @httpGet(
    "/trending",
    TYPES.CheckLoginStatusMiddleware,
    queryValidator(GetTrendDto)
  )
  public async getTrendPosts(
    @queryParam() query: GetTrendDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._postService.getTrends(user, query);

    return res.status(200).json(data);
  }

  // 게시글 상세 조회
  @httpGet("/:id", TYPES.CheckLoginStatusMiddleware, paramsValidator(IdDto))
  public async getDetailPost(
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
  public async getAllPosts(
    @queryParam() query: GetAllPostDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._postService.getAll(user, query);
    return res.status(200).json(data);
  }

  @httpPatch(
    "/:id",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(IdDto),
    bodyValidator(UpdatePostDto)
  )
  public async updatePost(
    @requestParam() param: IdDto,
    @requestBody() body: UpdatePostDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;
    const { title, content, isSecret } = body;

    const data = await this._postService.update(
      user,
      id,
      title,
      content,
      isSecret
    );

    return res.status(200).json(data);
  }
}

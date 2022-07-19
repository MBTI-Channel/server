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
import { TYPES } from "../../core/type.core";
import {
  bodyValidator,
  paramsValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import {
  CreateCommentDto,
  GetAllCommentDto,
  GetAllRepliesDto,
  UpdateCommentDto,
  DeleteCommentDto,
  IdDto,
} from "./dto";
import { ICommentService } from "./interfaces/IComment.service";

@controller("/comments")
export class CommentController {
  @inject(TYPES.ICommentService)
  private readonly _commentService: ICommentService;

  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreateCommentDto)
  )
  async createComment(
    @requestBody() body: CreateCommentDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { postId, content, isSecret } = body;

    const data = await this._commentService.createComment(
      user,
      postId,
      content,
      isSecret
    );

    return res.status(201).json(data);
  }

  // @httpPost(
  //   "/",
  //   TYPES.ValidateAccessTokenMiddleware,
  //   bodyValidator(CreateCommentDto)
  // )
  // async createReply(){

  // }

  @httpGet(
    "/",
    queryValidator(GetAllCommentDto),
    TYPES.CheckLoginStatusMiddleware
  ) //
  async findAllComments(
    @queryParam() query: GetAllCommentDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._commentService.findAllComments(query, user);
    return res.status(200).json(data);
  }

  // 대댓글 조회
  @httpGet(
    "/replies",
    queryValidator(GetAllRepliesDto),
    TYPES.CheckLoginStatusMiddleware
  )
  async findAllReplies(
    @queryParam() query: GetAllRepliesDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._commentService.findAllReplies(query, user);
    return res.status(200).json(data);
  }

  @httpPatch(
    "/:id",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(IdDto),
    bodyValidator(UpdateCommentDto)
  )
  async update(
    @requestParam() param: IdDto,
    @requestBody() body: UpdateCommentDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;
    const { content } = body;
    const data = await this._commentService.update(user, id, content);
    return res.status(200).json(data);
  }

  @httpDelete(
    "/:id",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(DeleteCommentDto)
  )
  async delete(
    @requestParam() param: DeleteCommentDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;

    await this._commentService.delete(user, id);

    return res.status(204).json();
  }
}

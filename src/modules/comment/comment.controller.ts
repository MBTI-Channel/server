import { Request, Response } from "express";
import { inject } from "inversify";
import {
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
import { CreateCommentDto, DeleteCommentDto } from "./dto";
import { GetAllCommentDto } from "./dto/get-all-comment.dto";
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

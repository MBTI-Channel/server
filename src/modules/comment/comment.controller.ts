import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpPost,
  requestBody,
  requestParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import {
  bodyValidator,
  paramsValidator,
} from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import { CreateCommentDto, DeleteCommentDto } from "./dto";
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

    return res.status(204);
  }
}

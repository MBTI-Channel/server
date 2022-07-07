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
import { CreateCommentDto } from "./dto/create-comment-dto";
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
}

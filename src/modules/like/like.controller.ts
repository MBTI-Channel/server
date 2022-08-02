import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpPost,
  queryParam,
  requestBody,
} from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import {
  bodyValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import { CreateLikeDto } from "./dto/create-like.dto";
import { DeleteLikeDto } from "./dto/delete-like.dto";
import { ILikeService } from "./interfaces/ILike.service";

@controller("/likes")
export class LikeController {
  @inject(TYPES.ILikeService) private readonly _likeService: ILikeService;

  // 좋아요 등록
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreateLikeDto)
  )
  async createLike(
    @requestBody() body: CreateLikeDto,
    req: Request,
    res: Response
  ) {
    const { type, targetId } = body;
    const user = req.user as User;

    const data = await this._likeService.createLike(type, targetId, user);

    return res.status(201).json(data);
  }

  // 좋아요 삭제
  @httpDelete(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    queryValidator(DeleteLikeDto)
  )
  async deleteLike(
    @queryParam() query: DeleteLikeDto,
    req: Request,
    res: Response
  ) {
    const { type, targetId } = query;
    const user = req.user as User;

    await this._likeService.deleteLike(type, targetId, user);

    return res.status(204).json();
  }
}

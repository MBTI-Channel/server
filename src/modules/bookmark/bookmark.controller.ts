import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpDelete,
  httpPost,
  requestBody,
  requestParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import {
  bodyValidator,
  paramsValidator,
} from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { IdDto } from "./dto/id.dto";
import { IBookmarkService } from "./interfaces/IBookmark.service";

@controller("/bookmarks")
export class BookmarkController {
  @inject(TYPES.IBookmarkService)
  private readonly _bookmarkService: IBookmarkService;
  // 북마크 등록
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreateBookmarkDto)
  )
  public async createBookmark(
    @requestBody() body: CreateBookmarkDto,
    req: Request,
    res: Response
  ) {
    const { targetId } = body;
    const user = req.user as User;

    const data = await this._bookmarkService.createBookmark(targetId, user);
    return res.status(201).json(data);
  }

  // 북마크 삭제
  @httpDelete(
    "/:id",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(IdDto)
  )
  public async delete(
    @requestParam() param: IdDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;

    await this._bookmarkService.delete(user, id);

    return res.status(204).json();
  }
}

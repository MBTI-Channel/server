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
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { IBookmarkService } from "./interfaces/IBookmark.service";

@controller("/bookmarks")
export class BookmarkController extends BaseHttpController {
  @inject(TYPES.IBookmarkService)
  private readonly _bookmarkService: IBookmarkService;
  // 북마크 등록
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreateBookmarkDto)
  )
  async createBookmark(
    @requestBody() body: CreateBookmarkDto,
    req: Request,
    res: Response
  ) {
    const { targetId } = body;
    const user = req.user as User;

    const data = await this._bookmarkService.createBookmark(targetId, user);
    return res.status(201).json(data);
  }
}

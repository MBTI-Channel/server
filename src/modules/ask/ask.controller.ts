import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody,
} from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import { bodyValidator } from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import { CreateAskDto } from "./dto/create-ask.dto";
import { IAskService } from "./interfaces/IAsk.service";

@controller("/asks")
export class AskController extends BaseHttpController {
  @inject(TYPES.IAskService) private readonly _askService: IAskService;

  // 문의 보내기
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreateAskDto)
  )
  public async createAsk(
    @requestBody() body: CreateAskDto,
    req: Request,
    res: Response
  ) {
    const { title, content, imageUrl, email } = body;
    const user = req.user as User;

    const data = await this._askService.create(
      user,
      title,
      content,
      imageUrl,
      email
    );
    return res.status(201).json(data);
  }
}

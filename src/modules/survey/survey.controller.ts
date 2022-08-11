import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import { bodyValidator } from "../../middlewares/validator.middleware";
import { User } from "../user/entity/user.entity";
import { CreateSurveyDto } from "./dto";
import { ISurveyService } from "./interfaces/ISurvey.service";

@controller("/surveys")
export class SurveyController {
  @inject(TYPES.ISurveyService) private readonly _surveyService: ISurveyService;
  // 찬성 반대 투표
  @httpPost(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(CreateSurveyDto)
  )
  public async createSurvey(
    @requestBody() body: CreateSurveyDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id, isAgree } = body;

    const data = await this._surveyService.create(user, id, isAgree);
    return res.status(200).json(data);
  }
}

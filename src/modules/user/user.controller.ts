import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  queryParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import { queryValidator } from "../../middlewares/validator.middleware";
import { IUserService } from "./interfaces/IUser.service";
import { NicknameDuplicateCheckDto } from "./dtos/nickname-duplicate-check.dto";

@controller("/users")
export class UserController extends BaseHttpController {
  @inject(TYPES.IUserService) private readonly userService: IUserService;

  // 닉네임 중복확인
  @httpGet("/", queryValidator(NicknameDuplicateCheckDto))
  async nicknameDuplicateCheck(
    @queryParam() dto: NicknameDuplicateCheckDto,
    req: Request,
    res: Response
  ) {
    const result = await this.userService.isExistsNickname(dto);
    return res.status(200).json({ isExistsNickname: result });
  }
}

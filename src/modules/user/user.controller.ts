import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  queryParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import {
  bodyValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { IUserService } from "./interfaces/IUser.service";
import { NicknameDuplicateCheckDto } from "./dtos/nickname-duplicate-check.dto";
import { OauthLoginDto } from "../auth/dtos/oauth-login.dto";
import { LoginDto } from "./dtos/login.dto";
import config from "../../config";

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

  @httpPost(
    "/login",
    bodyValidator(OauthLoginDto),
    TYPES.GetProviderUserByOauthMiddleware,
    TYPES.SocialSignUpMiddleware
  )
  async oauthLogin(req: Request, res: Response) {
    const dto = req.user as LoginDto;
    const { user, accessToken, refreshToken } = await this.userService.login(
      dto
    );
    res.cookie("Refresh", refreshToken, {
      httpOnly: true,
      secure: false, // true
      maxAge: config.cookie.refreshTokenMaxAge,
    });

    return res.status(201).json({
      nickname: user.nickname,
      mbti: user.mbti,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  }
}

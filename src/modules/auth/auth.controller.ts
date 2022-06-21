import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import { IAuthService } from "./interfaces/IAuth.service";
import { DtoValidatorMiddleware } from "../../middlewares/dto-validator.middleware";
import { LoginDto } from "./dtos/login.dto";
import { OauthLoginDto } from "./dtos/oauth-login.dto";
import config from "../../config";

@controller("/auth")
export class AuthController extends BaseHttpController {
  @inject(TYPES.IAuthService) private readonly authService: IAuthService;
  @httpPost(
    "/login",
    DtoValidatorMiddleware(OauthLoginDto),
    TYPES.GetProviderUserByOauthMiddleware,
    TYPES.SocialSignUpMiddleware
  )
  async oauthLogin(req: Request, res: Response) {
    const dto = req.user as LoginDto;
    const { user, accessToken, refreshToken } = await this.authService.login(
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

  @httpGet("/me", TYPES.AuthenticationMiddleware)
  async validateUser(req: Request, res: Response) {
    return res.status(200).json({
      message: "access token valid",
    });
  }

  @httpGet("/")
  async reissueAccessToken(req: Request, res: Response) {
    const { refreshTokenValid, newAccessToken } =
      await this.authService.reissueAccessToken(
        req.accessToken!,
        req.cookies.Refresh
      );

    if (!refreshTokenValid || newAccessToken === "undefined") {
      res.clearCookie("Refresh");
      // TODO: login page로 이동
    }

    return res.status(200).json({
      newAccessToken,
    });
  }

  // 임시 kakao 라우터
  @httpGet("/kakao")
  async kakaoLogin(req: Request, res: Response) {
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${config.naver.clientId}&redirect_uri=${config.naver.redirectUri}&state=${config.naver.randomState}`;
    return res.redirect(url);
  }

  // 임시 naver 라우터
  @httpGet("/naver")
  async naverLogin(req: Request, res: Response) {
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${config.naver.clientId}&redirect_uri=${config.naver.redirectUri}&state=${config.naver.randomState}`;
    return res.redirect(url);
  }

  // 임시 리다이렉트 라우터
  @httpGet("/redirect")
  async getAuthCode(req: Request, res: Response) {
    return res.status(200).json({ code: req.query.code });
  }
}

import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import config from "../config";
import { AuthService } from "../core/services/auth.service";
import { TYPES } from "../core/type.core";
import { User } from "../entities/user.entity";

@controller("/auth")
export class AuthController extends BaseHttpController {
  @inject(TYPES.IAuthService) private readonly authService: AuthService;

  @httpPost(
    "/login",
    TYPES.GetProviderUserByOauthMiddleware,
    TYPES.SocialSignUpMiddleware
  )
  async oauthLogin(req: Request, res: Response) {
    const { provider, providerId } = req.user as User;
    const { user, accessToken, refreshToken } = await this.authService.login(
      provider,
      providerId
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

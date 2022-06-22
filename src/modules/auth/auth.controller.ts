import { Request, Response } from "express";
import {
  BaseHttpController,
  controller,
  httpGet,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import config from "../../config";

@controller("/auth")
export class AuthController extends BaseHttpController {
  @httpGet("/me", TYPES.ValidateAccessTokenMiddleware)
  async validateUser(req: Request, res: Response) {
    return res.status(200).json({
      message: "access token valid",
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

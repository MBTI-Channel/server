import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { UnauthorizedException } from "../errors/all.exception";
import { NaverOauthService } from "../shared/oauth/naver-oauth.service";
import { KakaoOauthService } from "../shared/oauth/kakao-oauth.service";
import { IOauthService } from "../shared/oauth/interfaces/IOauth.service";
import { Logger } from "../utils/logger.util";

/**
 * Oauth 2.0 인증 후 reqeust에 user 정보를 할당해준다.
 */
@injectable()
export class GetProviderUserByOauth extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger)
    private readonly _logger: Logger,
    @inject(TYPES.NaverOauthService)
    private readonly _naverService: NaverOauthService,
    @inject(TYPES.KakaoOauthService)
    private readonly _kakaoService: KakaoOauthService
  ) {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction) {
    this._logger.trace(`[GetProviderUserByOauth] start`);

    const { provider, authCode } = req.body;

    let oauthProvider!: IOauthService;
    if (provider === "kakao") {
      oauthProvider = this._kakaoService;
    }
    if (provider === "naver") {
      oauthProvider = this._naverService;
    }

    try {
      // oauth 인증 서비스로부터 토큰 얻어오기
      this._logger.trace(
        `[GetProviderUserByOauth] start receiving provider token from ${provider}`
      );
      const providerAccessToken = await oauthProvider.getProviderAccessToken(
        authCode
      );
      if (!providerAccessToken)
        throw new UnauthorizedException("invallid auth code");

      // oauth api 서비스로부터 유저 정보 얻어오기
      this._logger.trace(
        `[GetProviderUserByOauth] start receiving provider user info from ${provider}`
      );
      const providerUserInfo = await oauthProvider.getProviderUserInfo(
        providerAccessToken
      );
      if (!providerUserInfo)
        throw new UnauthorizedException("invallid provider access token");

      // oauth 인증 서비스로부터 받은 토큰 만료
      this._logger.trace(
        `[GetProviderUserByOauth] start provider token expiration`
      );
      await oauthProvider.expiresProviderToken(providerAccessToken);
      req.user = providerUserInfo;

      this._logger.trace(`[GetProviderUserByOauth] call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

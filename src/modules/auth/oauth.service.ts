import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IOauthService } from "./interfaces/IOauth.service";
import { KakaoApiService } from "../../shared/api/kakao-api.service";
import { NaverApiService } from "../../shared/api/naver-api.service";
import { Logger } from "../../shared/utils/logger.util";
import { Provider } from "../../shared/type.shared";
import { UnauthorizedException } from "../../shared/errors/all.exception";

@injectable()
export class OauthService implements IOauthService {
  private _apiServiceList;

  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.NaverApiService)
    private readonly _naverApiService: NaverApiService,
    @inject(TYPES.KakaoApiService)
    private readonly _kakaoApiService: KakaoApiService
  ) {
    // api service list
    this._apiServiceList = {
      kakao: this._kakaoApiService,
      naver: this._naverApiService,
    };
  }

  private _getApiServiceByProvider(provider: Provider) {
    return this._apiServiceList[provider];
  }

  /**
   * provider에 따라 API 서비스로부터 유저 정보를 가져온다.
   */
  public async getUserInfoByProvider(provider: Provider, authCode: string) {
    const apiService = this._getApiServiceByProvider(provider);

    // authCode로 accessToken 얻어오기
    this._logger.trace(
      `[OauthService] start receiving provider token from ${provider}`
    );
    const accessToken = await apiService.getAccessToken(authCode);
    if (!accessToken) throw new UnauthorizedException("invallid auth code");

    // accessToken으로 userInfo 얻어오기
    this._logger.trace(
      `[OauthService] start receiving provider user info from ${provider}`
    );
    const userInfo = await apiService.getUserInfo(accessToken);
    if (!userInfo)
      throw new UnauthorizedException("invallid provider access token");

    // accessToken만료시켜 로그아웃 처리
    this._logger.trace(`[OauthService] start provider token expiration`);
    await apiService.expiresToken(accessToken);

    this._logger.trace(`[OauthService] return userInfo`);
    return userInfo;
  }
}

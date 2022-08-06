import axios from "axios";
import { plainToInstance } from "class-transformer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IApiAccountService } from "./interfaces/IApi-account.service";
import { Logger } from "../../shared/utils/logger.util";
import { KaKaoAccountDto } from "./dto/kakao-account.dto";
import config from "../../config";

const { kakao } = config;

@injectable()
export class KakaoApiService implements IApiAccountService {
  constructor(@inject(TYPES.Logger) private readonly _logger: Logger) {}

  public async getAccessToken(authCode: string): Promise<string | null> {
    const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakao.restApiKey}&redirect_uri=${kakao.redirectUri}&code=${authCode}`;
    try {
      const { data } = await axios.post(url, "", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      this._logger.trace(
        `[KakaoApiService] access token successfully received`
      );
      return data.access_token;
    } catch (err: any) {
      this._logger.warn(
        `[KakaoApiService] getAccessToken fail : ${err.response.data.error_description}`
      );
      return null;
    }
  }

  public async getUserInfo(accessToken: string) {
    const url = "https://kapi.kakao.com/v2/user/me";
    try {
      const { data } = await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });

      this._logger.trace(`[KakaoApiService] user info successfully received`);
      return plainToInstance(KaKaoAccountDto, {
        id: data.id,
        ageRange: data.kakao_account.age_range,
        gender: data.kakao_account.gender,
      });
    } catch (err: any) {
      this._logger.warn(
        `[KakaoApiService] getUserInfo fail : ${err.response.data.error_description}`
      );
      return null;
    }
  }

  public async expiresToken(accessToken: string) {
    const url = "https://kapi.kakao.com/v1/user/logout";
    try {
      await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      this._logger.trace(`[KakaoApiService] expires token successful`);
      return;
    } catch (err: any) {
      this._logger.warn(
        `[KakaoApiService] expiresToken fail : ${err.response.data.error_description}`
      );
      return;
    }
  }
}

import axios from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../utils/logger.util";
import { IProviderUserInfo } from "./interfaces/IProviderUserInfo";
import config from "../../config/index";
import { IOauthService } from "./interfaces/IOauth.service";

const { kakao } = config;
const PROVIDER = "kakao";

@injectable()
export class KakaoOauthService implements IOauthService {
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  public async getProviderAccessToken(authCode: string) {
    try {
      const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakao.restApiKey}&redirect_uri=${kakao.redirectUri}&code=${authCode}`;
      const { data } = await axios.post(url, "", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      const providerAccessToken = data.access_token;
      return providerAccessToken;
    } catch (err) {
      this.logger.http("invalid auth code");
      return null;
    }
  }

  public async getProviderUserInfo(accessToken: string) {
    try {
      const url = "https://kapi.kakao.com/v2/user/me";
      const { data } = await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      const providerUserInfo: IProviderUserInfo = {
        provider: PROVIDER,
        providerId: data.id,
        providerData: JSON.stringify(data.kakao_account),
      };
      return providerUserInfo;
    } catch (err) {
      this.logger.http("invalid provider access token");
      return null;
    }
  }

  public async expiresProviderToken(accessToken: string) {
    let url!: string;
    try {
      url = "https://kapi.kakao.com/v1/user/logout";
      await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      return;
    } catch (err) {
      this.logger.http("invaid porivder access token");
      return;
    }
  }
}

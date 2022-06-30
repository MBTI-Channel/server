import axios from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../utils/logger.util";
import { IProviderUserInfo } from "./interfaces/IProviderUserInfo";
import config from "../../config/index";
import { IOauthService } from "./interfaces/IOauth.service";

const { naver } = config;
const PROVIDER = "naver";

@injectable()
export class NaverOauthService implements IOauthService {
  constructor(@inject(TYPES.Logger) private readonly _logger: Logger) {}

  public async getProviderAccessToken(authCode: string) {
    try {
      const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naver.clientId}&client_secret=${naver.clientSecret}&redirect_uri=${naver.redirectUri}&code=${authCode}&state=${naver.randomState}`;

      const { data } = await axios.post(url, "", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      const providerAccessToken = data.access_token;
      this._logger.trace(
        `[NaverOauthService] access token successfully received`
      );
      return providerAccessToken;
    } catch (err) {
      this._logger.warn(
        `[NaverOauthService] invalid 'authCode' or check 'clientId' & 'clientSecret' of naver`
      );
      return null;
    }
  }

  public async getProviderUserInfo(accessToken: string) {
    try {
      const url = "https://openapi.naver.com/v1/nid/me";
      const { data } = await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      const { id, ...naver_account } = data.response;
      const providerUserInfo: IProviderUserInfo = {
        provider: PROVIDER,
        providerId: id,
        providerData: JSON.stringify(naver_account),
      };
      this._logger.trace(`[NaverOauthService] user info successfully received`);
      return providerUserInfo;
    } catch (err) {
      this._logger.warn(`[NaverOauthService] invalid access token`);
      return null;
    }
  }

  public async expiresProviderToken(accessToken: string) {
    let url!: string;
    try {
      url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${naver.clientId}&client_secret=${naver.clientSecret}&access_token=${accessToken}&service_provider=NAVER`;
      await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      this._logger.trace(`[NaverOauthService] request logout successful`);
      return;
    } catch (err) {
      this._logger.warn(
        `[NaverOauthService] invalid access token or check 'clientId' & 'clientSecret' of naver`
      );
      return;
    }
  }
}

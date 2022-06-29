import axios from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../utils/logger.util";
import { IProviderUserInfo } from "../../modules/auth/interfaces/IProviderUserInfo";
import config from "../../config/index";
import { IOauth } from "./interfaces/IOauth";

const { naver } = config;
const PROVIDER = "naver";

@injectable()
export class NaverOauth implements IOauth {
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  public async getProviderAccessToken(authCode: string) {
    try {
      const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naver.clientId}&client_secret=${naver.clientSecret}&redirect_uri=${naver.redirectUri}&code=${authCode}&state=${naver.randomState}`;

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
      return providerUserInfo;
    } catch (err) {
      this.logger.http("invalid provider access token");
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
      return;
    } catch (err) {
      this.logger.http("invaid porivder access token");
      return;
    }
  }
}

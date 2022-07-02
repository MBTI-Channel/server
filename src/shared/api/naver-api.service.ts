import axios from "axios";
import { plainToInstance } from "class-transformer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IApiService } from "./interfaces/IApi.service";
import { Logger } from "../../utils/logger.util";
import { NaverAccountDto } from "./dto/naver-account.dto";
import config from "../../config";

const { naver } = config;

@injectable()
export class NaverApiService implements IApiService {
  constructor(@inject(TYPES.Logger) private readonly _logger: Logger) {}

  async getAccessToken(authCode: string): Promise<string | null> {
    const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${naver.clientId}&client_secret=${naver.clientSecret}&redirect_uri=${naver.redirectUri}&code=${authCode}&state=${naver.randomState}`;
    try {
      const { data } = await axios.post(url, "", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      this._logger.trace(
        `[NaverApiService] access token successfully received`
      );
      return data.access_token;
    } catch (err) {
      this._logger.warn(
        `[NaverApiService] invalid 'authCode' or check 'clientId' & 'clientSecret' of naver`
      );
      return null;
    }
  }

  async getUserInfo(accessToken: string) {
    const url = "https://openapi.naver.com/v1/nid/me";
    try {
      const { data } = await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      this._logger.trace(`[NaverApiService] user info successfully received`);
      return plainToInstance(NaverAccountDto, data.response);
    } catch (err) {
      this._logger.warn(`[NaverApiService] invalid access token`);
      return null;
    }
  }

  async expiresToken(accessToken: string) {
    const url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${naver.clientId}&client_secret=${naver.clientSecret}&access_token=${accessToken}&service_provider=NAVER`;
    try {
      await axios.post(url, "", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      });
      this._logger.trace(`[NaverApiService] expires token successful`);
      return;
    } catch (err) {
      this._logger.warn(
        `[NaverApiService] invalid access token or check 'clientId' & 'clientSecret' of naver`
      );
      return;
    }
  }
}

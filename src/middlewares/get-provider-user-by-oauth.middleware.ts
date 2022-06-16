import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import axios from "axios";
import { TYPES } from "../core/type.core";
import { Logger } from "../utils/logger.util";
import { Provider } from "../entities/user.entity";
import { OauthLoginDto } from "../dtos/index.dto";
import { IProviderUserInfo } from "./interfaces/IProviderUserInfo";
import {
  UnauthorizedException,
  ValidationErrorException,
} from "../errors/all.exception";
import config from "../config/index";

/**
 * Oauth 2.0 인증 후 reqeust에 user 정보를 할당해준다.
 */
@injectable()
export class GetProviderUserByOauth extends BaseMiddleware {
  @inject(TYPES.Logger) private readonly logger: Logger;
  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(OauthLoginDto, req.body); // plainToInstance: 리터럴 객체 -> 클래스 객체
      // 유효성 검사
      const validationErrors = await this.isValid(dto);
      if (validationErrors)
        throw new ValidationErrorException("bad request", validationErrors);

      const { provider, authCode } = dto;

      // oauth 인증 서비스로부터 토큰 얻어오기
      const providerAccessToken = await this.getProviderAccessToken(
        provider,
        authCode
      );
      if (!providerAccessToken)
        throw new UnauthorizedException("invallid auth code");

      // oauth api 서비스로부터 유저 정보 얻어오기
      const providerUserInfo = await this.getProviderUserInfo(
        provider,
        providerAccessToken
      );
      if (!providerUserInfo)
        throw new UnauthorizedException("invallid provider access token");

      // oauth 인증 서비스로부터 받은 토큰 만료
      await this.expiresProviderToken(provider, providerAccessToken);

      req.user = providerUserInfo;

      return next();
    } catch (err) {
      return next(err);
    }
  }

  private async isValid(dto: OauthLoginDto) {
    return validateOrReject(dto).catch((errors: ValidationError[]) => {
      let errorsMessageArray: string[] = [];
      errors.forEach((errors) => {
        errorsMessageArray.push(...(Object as any).values(errors.constraints));
      });
      console.log(errorsMessageArray);
      return errorsMessageArray;
    });
  }

  private async getProviderAccessToken(provider: Provider, authCode: string) {
    let providerAccessToken!: string;
    try {
      if (provider === "kakao") {
        const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${config.kakao.restApiKey}&redirect_uri=${config.kakao.redirectUri}&code=${authCode}`;
        const { data } = await axios.post(url, "", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });
        providerAccessToken = data.access_token;
      } else if (provider === "naver") {
        //TODO: naver
        providerAccessToken = "";
      }
      return providerAccessToken;
    } catch (err) {
      this.logger.http("invalid auth code");
      return null;
    }
  }

  private async getProviderUserInfo(provider: Provider, accessToken: string) {
    let providerUserInfo!: IProviderUserInfo;
    try {
      if (provider === "kakao") {
        const url = "https://kapi.kakao.com/v2/user/me";
        const { data } = await axios.post(url, "", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });
        providerUserInfo = {
          providerId: data.id,
          providerData: JSON.stringify(data.kakao_account),
        };
      }
      if (provider === "naver") {
        //TODO: naver
      }
      return providerUserInfo;
    } catch (err) {
      this.logger.http("invalid provider access token");
      return null;
    }
  }

  private async expiresProviderToken(provider: Provider, accessToken: string) {
    try {
      if (provider === "kakao") {
        const url = "https://kapi.kakao.com/v1/user/logout";
        await axios.post(url, "", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });
      }
      if (provider === "naver") {
        //TODO: naver
      }
      return;
    } catch (err) {
      this.logger.http("invaid porivder access token");
      return;
    }
  }
}

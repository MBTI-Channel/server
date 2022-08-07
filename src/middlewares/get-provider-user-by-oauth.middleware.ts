import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/types.core";
import { UserBase } from "../modules/user/entity/userbase";
import { IOauthService } from "../modules/auth/interfaces/IOauth.service";
import { Logger } from "../shared/utils/logger.util";

/**
 * Oauth 2.0 인증 후 reqeust.user에 user를 할당해준다.
 */
@injectable()
export class GetProviderUserByOauth extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger)
    private readonly _logger: Logger,
    @inject(TYPES.IOauthService)
    private readonly _oauthService: IOauthService
  ) {
    super();
  }

  private _log(message: string) {
    this._logger.trace(`[GetProviderUserByOauth] ${message}`);
  }

  public async handler(req: Request, res: Response, next: NextFunction) {
    this._log("start");
    const { provider, authCode } = req.body;
    try {
      const providerUserInfo = await this._oauthService.getUserInfoByProvider(
        provider,
        authCode
      );

      req.user = plainToInstance(UserBase, {
        provider,
        providerId: providerUserInfo.id,
        gender: providerUserInfo.gender,
        ageRange: providerUserInfo.ageRange,
      });

      this._log("call next");
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

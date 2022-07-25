import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { plainToInstance } from "class-transformer";
import { TYPES } from "../core/type.core";
import { AuthService } from "../modules/auth/auth.service";
import { JwtUtil } from "../shared/utils/jwt.util";
import { Logger } from "../shared/utils/logger.util";
import {
  BadReqeustException,
  UnauthorizedException,
} from "../shared/errors/all.exception";
import { User } from "../modules/user/entity/user.entity";

@injectable()
export class ValidateReissueToken extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IAuthService) private readonly _authService: AuthService
  ) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this._logger.trace(`[ValidateReissueToken] start`);
      const AUTH_TYPE = "Bearer ";
      const header = req.headers.authorization;

      let accessToken: string;
      let refreshToken: string;

      // access token이 authorization 헤더와 Bearer 타입인지 확인
      if (header && header.startsWith(AUTH_TYPE)) {
        accessToken = header.split(" ")[1];
      } else {
        this._logger.trace(
          `[ValidateReissueToken] access token not in 'authorization' header or 'Bearer ' type`
        );
        throw new UnauthorizedException("authentication error");
      }

      const { status: accessTokenStatus } = this._jwtUtil.verify(accessToken);
      // 재발급시에 access token이 만료되어야 하므로 에러
      if (accessTokenStatus === "success") {
        this._logger.trace(`[ValidateReissueToken] access token should expire`);
        throw new BadReqeustException("access token should expire");
      }
      // access token 검증 에러
      if (accessTokenStatus === "invalid") {
        this._logger.trace(`[ValidateReissueToken] authentication error`);
        throw new UnauthorizedException("authentication error");
      }

      // access token의 payload가 유효한 사용자 확인
      const accessTokenDecoded = this._jwtUtil.decode(accessToken);
      if (!accessTokenDecoded) {
        this._logger.trace(`[ValidateReissueToken] authentication error`);
        throw new UnauthorizedException("authentication error");
      }

      const { id, nickname, mbti } = accessTokenDecoded;
      await this._authService.validateUserWithToken(id, nickname, mbti);

      // refresh token이 쿠키에 있는지 확인
      refreshToken = req.cookies.Refresh;
      if (!refreshToken) {
        this._logger.trace(
          `[ValidateReissueToken] refresh token not in cookie`
        );
        throw new UnauthorizedException("authentication error");
      }

      // refresh token 검증
      const { status: refreshTokenStatus } = this._jwtUtil.verify(refreshToken);
      if (refreshTokenStatus === "invalid") {
        this._logger.trace(`[ValidateReissueToken] invald refresh token`);
        res.clearCookie("Refresh");
        throw new UnauthorizedException("authentication error");
      }
      if (refreshTokenStatus === "expired") {
        this._logger.trace(`[ValidateReissueToken] expired refresh token`);
        res.clearCookie("Refresh");
        throw new UnauthorizedException("authentication error");
      }

      req.user = plainToInstance(User, {
        id: accessTokenDecoded.id,
        nickname: accessTokenDecoded.nickname,
        mbti: accessTokenDecoded.mbti,
        isAdmin: accessTokenDecoded.isAdmin,
      });

      this._logger.trace(`[ValidateReissueToken] call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

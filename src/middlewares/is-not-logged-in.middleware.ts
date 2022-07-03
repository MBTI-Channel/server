import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { UnauthorizedException } from "../shared/errors/all.exception";
import { JwtUtil } from "../shared/utils/jwt.util";
import { Logger } from "../shared/utils/logger.util";

@injectable()
export class IsNotLoggedIn extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil
  ) {
    super();
  }

  public async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this._logger.trace(`[IsNotLoggedIn] start`);
      const AUTH_TYPE = "Bearer ";
      const header = req.headers.authorization;

      let accessToken: string;
      let refreshToken: string;

      // access token 유효 여부 판단
      // 로그인 | 회원가입 시 유효한 access token 있으면 안됨
      if (header && header.startsWith(AUTH_TYPE)) {
        accessToken = header.split(" ")[1];
        const { status: accessTokenStatus } = this._jwtUtil.verify(accessToken);
        if (accessTokenStatus === "success") {
          this._logger.trace(`[IsNotLoggedIn] jwt is valid`);
          throw new UnauthorizedException("authentication error");
        }
      }

      // refresh token 유효 여부 판단
      // 로그인 | 회원가입 시 유효한 refresh token 있으면 안됨
      refreshToken = req.cookies.Refresh;
      if (refreshToken) {
        const { status: refreshTokenStatus } =
          this._jwtUtil.verify(refreshToken);
        if (refreshTokenStatus === "success") {
          this._logger.trace(`[IsNotLoggedIn] jwt is valid`);
          throw new UnauthorizedException("authentication error");
        }
      }

      this._logger.trace(`[IsNotLoggedIn] call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

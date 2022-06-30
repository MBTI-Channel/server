import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";
import { Logger } from "../utils/logger.util";

@injectable()
export class ValidateReissueToken extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil
  ) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
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
      return res.status(401).json({
        message: "authentication error",
      });
    }

    let { status: accessTokenStatus } = this._jwtUtil.verify(accessToken);
    // 재발급시에 access token이 만료되어야 하므로 에러
    if (accessTokenStatus === "success") {
      this._logger.trace(`[ValidateReissueToken] access token should expire`);
      return res.status(400).json({
        message: "access token should expire",
      });
    }
    // access token 검증 에러
    if (accessTokenStatus === "invalid") {
      this._logger.trace(`[ValidateReissueToken] authentication error`);
      return res.status(401).json({
        message: "authentication error",
      });
    }

    // refresh token이 쿠키에 있는지 확인
    refreshToken = req.cookies.Refresh;
    if (!refreshToken) {
      this._logger.trace(`[ValidateReissueToken] refresh token not in cookie`);
      return res.status(401).json({
        message: "authentication error",
      });
    }

    // refresh token 검증
    let { status: refreshTokenStatus } = this._jwtUtil.verify(refreshToken);
    if (refreshTokenStatus === "invalid") {
      this._logger.trace(`[ValidateReissueToken] invald refresh token`);
      res.clearCookie("Refresh");
      return res.status(401).json({
        message: "authentication error",
      });
    }
    if (refreshTokenStatus === "expired") {
      this._logger.trace(`[ValidateReissueToken] expired refresh token`);
      res.clearCookie("Refresh");
      return res.status(401).json({
        message: "authentication error",
      });
    }

    this._logger.trace(`[ValidateReissueToken] call next`);
    return next();
  }
}

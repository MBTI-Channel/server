import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";
import { Logger } from "../utils/logger.util";

@injectable()
export class ValidateAccessToken extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil
  ) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    this._logger.trace(`[ValidateAccessToken] start`);
    const AUTH_TYPE = "Bearer ";
    const header = req.headers.authorization;

    let accessToken: string;

    // 요청 헤더와 타입이 맞다면 accessToken 할당
    if (header && header.startsWith(AUTH_TYPE)) {
      accessToken = header.split(" ")[1];
    } else {
      this._logger.trace(
        `[ValidateAccessToken] access token not in 'authorization' header or 'Bearer ' type`
      );
      return res.status(401).json({
        message: "authentication error",
      });
    }

    // access token 유효 여부 판단
    let decoded = this._jwtUtil.verify(accessToken);
    if (decoded.status !== "success") {
      this._logger.trace(`[ValidateAccessToken] jwt verify error`);
      return res.status(401).json({
        message: "authentication error",
      });
    }

    req.user = {
      id: decoded.id,
      nickname: decoded.nickname,
      mbti: decoded.mbti,
      isAdmin: decoded.isAdmin,
    };

    this._logger.trace(`[ValidateAccessToken] call next`);
    return next();
  }
}

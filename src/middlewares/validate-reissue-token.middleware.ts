import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";

@injectable()
export class ValidateReissueToken extends BaseMiddleware {
  constructor(@inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    const AUTH_TYPE = "Bearer ";
    const header = req.headers.authorization;

    let accessToken: string;
    let refreshToken: string;

    if (header && header.startsWith(AUTH_TYPE)) {
      accessToken = header.split(" ")[1];
    } else {
      return res.status(401).json({
        message: "authentication error",
      });
    }

    let accessTokenDecoded = this._jwtUtil.verify(accessToken);
    // id가 존재한다면 유효한 토큰
    // refresh 재발급시에 access token이 만료되어야 하므로 에러
    if (accessTokenDecoded.id) {
      return res.status(400).json({
        message: "access token should expire",
      });
    }

    refreshToken = req.cookies.Refresh;
    if (!refreshToken) {
      return res.status(401).json({
        message: "authentication error",
      });
    }

    let refreshTokenDecoded = this._jwtUtil.verify(refreshToken);
    if (!refreshTokenDecoded.iss) {
      res.clearCookie("Refresh");
      return res.status(401).json({
        message: "authentication error",
      });
    }

    return next();
  }
}

import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";

@injectable()
export class ValidateAccessToken extends BaseMiddleware {
  constructor(@inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    const AUTH_TYPE = "Bearer ";
    const header = req.headers.authorization;

    let accessToken: string;

    // 요청 헤더와 타입이 맞다면 accessToken 할당
    if (header && header.startsWith(AUTH_TYPE)) {
      accessToken = header.split(" ")[1];
    } else {
      return res.status(401).json({
        message: "authentication error",
      });
    }

    // access token 유효 여부 판단
    let decoded = this._jwtUtil.verify(accessToken);
    if (!decoded.id) {
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

    return next();
  }
}

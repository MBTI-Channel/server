import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";

@injectable()
export class ValidateAccessToken extends BaseMiddleware {
  constructor(@inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    const AUTH_TYPE = "Bearer ";
    const header = req.headers.authorization;

    if (header && header.startsWith(AUTH_TYPE)) {
      const accessToken = header.split(" ")[1];
      // access token 유효 여부 판단
      let decoded = this.jwtUtil.verify(accessToken);
      if (!decoded.id) {
        return res.status(401).json({
          message: "access token is not validate",
        });
      }

      req.user = {
        id: decoded.id,
        nickname: decoded.nickname,
        mbti: decoded.mbti,
        isAdmin: decoded.isAdmin,
      };

      next();
    }

    return res.status(401).json({
      message: "header is not validate",
    });
  }
}

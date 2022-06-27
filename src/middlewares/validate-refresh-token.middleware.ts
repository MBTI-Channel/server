import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";

@injectable()
export class ValidateRefreshToken extends BaseMiddleware {
  constructor(@inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.Refresh;
    const authHeader = req.headers.authorization;

    if (!refreshToken) {
      res.status(401).json({
        message: "refresh token is required",
      });
    }

    // authorization 헤더에 존재 x
    if (!authHeader) {
      return res.status(401).json({
        message: "Header authorization is required",
      });
    }

    // 인증 TYPE이 Bearer Token인지 확인
    if (!authHeader.includes("Bearer")) {
      return res.status(401).json({
        message: "Wrong authorization type",
      });
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const accessTokenDecoded = this.jwtUtil.verify(accessToken);
    if (accessTokenDecoded.id) {
      return res.status(401).json({
        message: "access token is not valid",
      });
    }

    const refreshTokenDecoded = this.jwtUtil.verify(refreshToken);
    console.log(refreshTokenDecoded);
    if (!refreshTokenDecoded.iss) {
      res.clearCookie("Refresh");
      return res.status(401).json({
        message: "refresh token is not valid",
      });
    }

    next();
  }
}

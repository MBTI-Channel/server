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
    const authHeader = req.headers.authorization;

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

    // access token 만료 여부 판단
    let decoded = this.jwtUtil.verify(accessToken);
    if (!decoded.id) {
      return res.status(400).json({
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
}

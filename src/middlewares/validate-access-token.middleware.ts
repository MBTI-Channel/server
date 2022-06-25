import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { JwtUtil } from "../utils/jwt.util";
import { User } from "../modules/user/entity/user.entity";

@injectable()
export class ValidateAccessToken extends BaseMiddleware {
  constructor(@inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers?.authorization?.replace("Bearer ", "");

    // access token 유무 확인
    if (!accessToken) {
      return res.status(401).json({
        message: "access token is required",
      });
    }

    // access token 만료 여부 판단
    try {
      let decoded = this.jwtUtil.verify(accessToken);
      req.user = {
        id: decoded.id,
        nickname: decoded.nickname,
        mbti: decoded.mbti,
        isAdmin: decoded.isAdmin,
      };

      next();
    } catch (err) {
      // access token 유효하지 않음
      return res.status(400).json({
        message: "access token is not validate",
      });
    }
  }
}

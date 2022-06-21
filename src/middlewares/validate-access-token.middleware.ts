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
    const accessToken = req.headers?.authorization?.replace("Bearer ", "");

    // access token 유무 확인
    if (!accessToken) {
      return res.status(401).json({
        message: "access token not exists",
      });
    }

    req.accessToken = accessToken;

    // access token 만료 여부 판단
    let isValidate = this.jwtUtil.verify(accessToken);

    if (!isValidate) {
      // TODO : refresh token 재발급으로 이동
      return res.status(400).json({
        message: "access token is not validate",
      });
    }
    next();
  }
}

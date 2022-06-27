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

    let accessTokenDecoded = this.jwtUtil.verify(accessToken);
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

    let refreshTokenDecoded = this.jwtUtil.verify(refreshToken);
    if (!refreshTokenDecoded.iss) {
      res.clearCookie("Refresh");
      return res.status(401).json({
        message: "authentication error",
      });
    }

    return next();
  }
}

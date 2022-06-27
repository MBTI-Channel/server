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
    const AUTH_TYPE = "Bearer ";
    const header = req.headers.authorization;

    if (!refreshToken) {
      res.status(401).json({
        message: "refresh token is required",
      });
    }

    if (header && header.startsWith(AUTH_TYPE)) {
      const accessToken = header.split(" ")[1];
      const accessTokenDecoded = this.jwtUtil.verify(accessToken);
      if (accessTokenDecoded.id) {
        return res.status(401).json({
          message: "access token should expire",
        });
      }
    }

    const refreshTokenDecoded = this.jwtUtil.verify(refreshToken);
    if (!refreshTokenDecoded.iss) {
      res.clearCookie("Refresh");
      return res.status(401).json({
        message: "refresh token is not valid",
      });
    }

    next();
  }
}

import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/types.core";
import { IAuthService } from "../modules/auth/interfaces/IAuth.service";
import { User } from "../modules/user/entity/user.entity";
import { UnauthorizedException } from "../shared/errors/all.exception";
import { JwtUtil } from "../shared/utils/jwt.util";
import { Logger } from "../shared/utils/logger.util";

@injectable()
export class ValidateAccessRefreshToken extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IAuthService) private readonly _authService: IAuthService
  ) {
    super();
  }

  private _log(message: string) {
    this._logger.trace(`[ValidateAccessRefreshToken] ${message}`);
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this._log(`start`);
      const AUTH_TYPE = "Bearer ";
      const header = req.headers.authorization;

      let accessToken: string;
      let refreshToken: string;

      // 요청 헤더와 타입이 맞다면 accessToken 할당
      if (header && header.startsWith(AUTH_TYPE)) {
        accessToken = header.split(" ")[1];
      } else {
        this._log(
          `access token not in 'authorization' header or 'Bearer ' type`
        );
        throw new UnauthorizedException("authentication error");
      }

      // access token 유효 여부 판단
      const decoded = this._jwtUtil.verify(accessToken);
      if (decoded.status === "invalid") {
        this._log(`jwt verify error`);
        throw new UnauthorizedException("authentication error");
      }
      if (decoded.status === "expired") {
        this._log(`jwt expired`);
        throw new UnauthorizedException("access token expired");
      }

      // access token의 payload가 유효한 사용자 확인
      const { id, nickname, mbti } = decoded;
      await this._authService.validateUserWithToken(id, nickname, mbti);

      // refresh token이 쿠키에 있는지 확인
      refreshToken = req.cookies.Refresh;
      if (!refreshToken) {
        this._log(`refresh token not in cookie error`);
        throw new UnauthorizedException("authentication error");
      }

      // refresh token 검증
      const { status: refreshTokenStatus } = this._jwtUtil.verify(refreshToken);
      if (refreshTokenStatus === "invalid") {
        this._log(`inavlid refresh token`);
        res.clearCookie("Refresh");
        throw new UnauthorizedException("authentication error");
      }
      if (refreshTokenStatus === "expired") {
        this._log(`expired refresh token`);
        res.clearCookie("Refresh");
        throw new UnauthorizedException("authentication error");
      }

      req.user = plainToInstance(User, {
        id: decoded.id,
        nickname: decoded.nickname,
        mbti: decoded.mbti,
        isAdmin: decoded.isAdmin,
        createdAt: decoded.createdAt,
      });

      this._log(`call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
